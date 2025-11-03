// server.js (ĐÃ SỬA LỖI NODEMAILER VÀ SỬ DỤNG .ENV)
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const initializeDatabase = require('./database');

// ⭐ 1. Import và Cấu hình DOTENV (Phải đặt ở đầu file)
require('dotenv').config();

const app = express();
const PORT = 3000;

// 1. Cấu hình EJS và Static Files (Giữ nguyên)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ⭐ 2. Cấu hình Nodemailer Transporter
// Lấy thông tin từ Biến Môi trường (File .env)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        // Lấy từ file .env
        user: process.env.EMAIL_USER,
        // Lấy từ file .env (Phải là App Password)
        pass: process.env.EMAIL_PASS
    }
});


// Đặt toàn bộ logic server vào trong callback của initializeDatabase
initializeDatabase((err, db) => {
    if (err) {
        console.error("❌ Server failed to start due to database error:", err.message);
        return;
    }

    console.log(`\n======================================================`);
    console.log(`✅ Database initialized successfully. Starting Server...`);
    // ⭐ Kiểm tra Cấu hình Email
    if (!process.env.EMAIL_PASS) {
        console.log(`🚨 CẢNH BÁO: EMAIL_PASS chưa được đặt trong file .env. Gửi email sẽ lỗi!`);
    } else {
        console.log(`✅ Cấu hình Email đã sẵn sàng.`);
    }
    console.log(`======================================================`);

    // ---------------------- ĐỊNH TUYẾN (ROUTING) ----------------------

    // Route Trang Chủ (Giữ nguyên)
    app.get('/', (req, res) => {
        const rankingSql = "SELECT * FROM books WHERE category = 'Đọc nhiều' ORDER BY rating DESC LIMIT 6";
        const generalBookSql = "SELECT * FROM books WHERE category = 'Sách' LIMIT 6";
        const storySql = "SELECT * FROM books WHERE category = 'Truyện' LIMIT 6";

        db.all(rankingSql, [], (err, rankingBooks) => {
            if (err) {
                console.error("Database query error for Ranking: " + err.message);
                return res.status(500).send("Lỗi Server khi truy vấn dữ liệu Bảng Xếp Hạng.");
            }

            db.all(generalBookSql, [], (err, generalBooks) => {
                if (err) {
                    console.error("Database query error for Books: " + err.message);
                    return res.status(500).send("Lỗi Server khi truy vấn dữ liệu Sách.");
                }

                db.all(storySql, [], (err, stories) => {
                    if (err) {
                        console.error("Database query error for Stories: " + err.message);
                        return res.status(500).send("Lỗi Server khi truy vấn dữ liệu Truyện.");
                    }

                    res.render('index', {
                        title: 'Arva - Thư viện Sách Online',
                        rankingBooks: rankingBooks,
                        generalBooks: generalBooks,
                        stories: stories,
                        message: req.query.message || '',
                        messageType: req.query.messageType || ''
                    });
                });
            });
        });
    });

    // Route Tìm Kiếm (Giữ nguyên)
    app.get('/search', (req, res) => {
        const query = req.query.q;

        if (!query || query.trim() === '') {
            return res.redirect('/?message=Vui lòng nhập từ khóa tìm kiếm.&messageType=warning');
        }

        const searchPattern = `%${query.trim()}%`;

        const sql = `
            SELECT * FROM books 
            WHERE title LIKE ? COLLATE NOCASE 
            OR author LIKE ? COLLATE NOCASE
            LIMIT 50
        `;

        db.all(sql, [searchPattern, searchPattern], (err, books) => {
            if (err) {
                console.error("Database query error for Search: " + err.message);
                return res.status(500).render('search_results', {
                    title: 'Lỗi Tìm kiếm',
                    searchQuery: query,
                    books: [],
                    message: 'Đã xảy ra lỗi server khi tìm kiếm.',
                    messageType: 'error'
                });
            }

            res.render('search_results', {
                title: `Kết quả tìm kiếm cho "${query}"`,
                searchQuery: query,
                books: books,
                message: books.length > 0 ? `Tìm thấy ${books.length} kết quả cho "${query}"` : `Không tìm thấy kết quả nào cho "${query}"`,
                messageType: books.length > 0 ? 'success' : 'warning'
            });
        });
    });

    // ---------------------- Route Chi Tiết Sách (SỬ DỤNG DB CHO COMMENT) ----------------------
    app.get('/book/:id', (req, res) => {
        const bookId = req.params.id;

        const bookSql = `SELECT * FROM books WHERE id = ?`;

        // ⭐ Lấy bình luận từ database (giả định bảng 'comments')
        const commentsSql = `SELECT user, text, date FROM comments WHERE book_id = ? ORDER BY date DESC`;

        db.get(bookSql, [bookId], (err, book) => {
            if (err) {
                console.error("Database query error for Book Detail: " + err.message);
                return res.status(500).send("Lỗi Server khi truy vấn chi tiết sách.");
            }

            if (!book) {
                return res.status(404).redirect('/?message=Không tìm thấy cuốn sách bạn yêu cầu.&messageType=error');
            }

            // Truy vấn bình luận
            db.all(commentsSql, [bookId], (err, comments) => {
                if (err) {
                    console.error("Database query error for Comments: " + err.message);
                    // Vẫn hiển thị trang sách ngay cả khi bình luận lỗi
                    comments = [];
                }

                const successMessage = req.query.message;

                res.render('book_detail', {
                    title: book.title,
                    book: book,
                    comments: comments, // Danh sách bình luận từ DB
                    message: successMessage || '',
                    messageType: successMessage ? 'success' : ''
                });
            });
        });
    });

    // ---------------------- Route GỬI BÌNH LUẬN (LƯU VÀO DATABASE) ----------------------
    app.post('/book/:id/comment', (req, res) => {
        const bookId = req.params.id;
        const commentText = req.body.commentText;

        if (!commentText || commentText.trim() === '') {
            return res.redirect(`/book/${bookId}?message=Bình luận không được để trống.`);
        }

        // Lấy ngày hiện tại ở định dạng YYYY-MM-DD (phù hợp cho SQLite)
        const now = new Date();
        const dateString = now.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        const dummyUser = 'Người Dùng Khách';

        // ⭐ Lệnh SQL để CHÈN bình luận vào bảng 'comments'
        const insertSql = `
            INSERT INTO comments (book_id, user, text, date) 
            VALUES (?, ?, ?, ?)
        `;

        // Thực thi lệnh chèn
        db.run(insertSql, [bookId, dummyUser, commentText.trim(), dateString], function (err) {
            if (err) {
                console.error("Database INSERT error for Comment: " + err.message);
                return res.redirect(`/book/${bookId}?message=Lỗi server khi lưu bình luận.&messageType=error`);
            }

            // Chuyển hướng lại trang chi tiết sách với thông báo thành công
            res.redirect(`/book/${bookId}?message=Bình luận của bạn đã được gửi thành công!`);
        });
    });

    // Route Xem Trước/Đọc Ngay (Giữ nguyên)
    app.get('/book/:id/preview', (req, res) => {
        const bookId = req.params.id;
        const sql = `SELECT * FROM books WHERE id = ?`;

        db.get(sql, [bookId], (err, book) => {
            if (err) {
                console.error("Database query error for Book Preview: " + err.message);
                return res.status(500).send("Lỗi Server khi truy vấn nội dung xem trước.");
            }

            if (!book) {
                return res.status(404).redirect('/?message=Không tìm thấy cuốn sách bạn yêu cầu.&messageType=error');
            }

            try {
                res.render('book_preview', {
                    title: book.title,
                    book: book,
                });
            } catch (e) {
                console.error("ERROR: views/book_preview.ejs file not found or failed to render.", e.message);
                res.status(500).send("Lỗi Server: Không tìm thấy trang xem trước. Vui lòng tạo file views/book_preview.ejs.");
            }
        });
    });

    // Route Trang Liên Hệ (Giữ nguyên)
    app.get('/contact', (req, res) => {
        try {
            // Có thể thêm message và messageType vào để hiển thị thông báo thành công/thất bại từ route POST
            res.render('contact', {
                title: 'Liên Hệ với ArvaLibrary',
                message: req.query.message || '',
                messageType: req.query.messageType || ''
            });
        } catch (e) {
            console.error("ERROR: views/contact.ejs file not found or failed to render.", e.message);
            res.status(500).send("Lỗi Server: Không tìm thấy trang liên hệ. Vui lòng kiểm tra file views/contact.ejs.");
        }
    });


    app.post('/contact', (req, res) => {
        const { recipient_email, your_email, subject, message } = req.body;
        // Sử dụng email từ biến môi trường làm email nhận
        const recipient = process.env.EMAIL_USER || 'arvalibrary@gmail.com';
        const sender = your_email;
        const mailSubject = subject;
        const mailBody = message;

        // 1. Kiểm tra dữ liệu bắt buộc
        if (!sender || !mailSubject || !mailBody) {
            return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ các trường bắt buộc.' });
        }

        // 2. Kiểm tra Mật khẩu ứng dụng đã được thiết lập chưa
        if (!process.env.EMAIL_PASS) {
            console.error("❌ Lỗi cấu hình: EMAIL_PASS (App Password) chưa được đặt trong file .env!");
            return res.status(500).json({ success: false, message: 'Lỗi cấu hình Server: Thiếu thông tin xác thực email.' });
        }


        // 3. Cấu hình nội dung email
        const mailOptions = {
            from: `"ArvaLibrary Contact Form" <${recipient}>`, // Email của server (ArvaLibrary@gmail.com)
            to: recipient, // Email nhận là ArvaLibrary@gmail.com
            replyTo: sender, // Thiết lập để có thể nhấn trả lời trực tiếp đến email người dùng
            subject: `[Yêu Cầu Liên Hệ] ${mailSubject}`,
            html: `
                <p>Bạn nhận được một yêu cầu liên hệ/đặt sách mới từ trang web:</p>
                <hr>
                <p><strong>Email Người Gửi:</strong> ${sender}</p>
                <p><strong>Tiêu Đề:</strong> ${mailSubject}</p>
                <hr>
                <p><strong>Nội Dung Chi Tiết:</strong></p>
                <div style="border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9;">
                    ${mailBody.replace(/\n/g, '<br>')}
                </div>
                <hr>
                <p>Vui lòng phản hồi sớm nhất có thể.</p>
            `
        };

        // 4. Gửi email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("❌ Lỗi khi gửi email:", error);
                // Trả về JSON lỗi (để client/JS xử lý)
                return res.status(500).json({ success: false, message: 'Lỗi Server khi gửi email.' });
            }

            console.log(`✅ Email đã gửi thành công: ${info.response}`);
            // Trả về JSON thành công (để client/JS xử lý)
            res.status(200).json({ success: true, message: 'Yêu cầu của bạn đã được gửi thành công!' });
        });
    });

    // 5. Khởi động Server
    app.listen(PORT, () => {
        console.log(`🌐 Server đang chạy tại http://localhost:${PORT}`);
        console.log('Sử dụng lệnh "npm start" để chạy lại.');
        console.log(`======================================================`);
    });
});