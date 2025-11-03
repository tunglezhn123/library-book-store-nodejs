// database.js (ĐÃ SỬA ĐỔI - Thêm bảng 'comments')
const sqlite3 = require('sqlite3').verbose();
const dbFile = './book_store.db'; // Giữ nguyên tên file database

// Hàm chèn dữ liệu sách mẫu (giữ nguyên logic)
function seedBookData(db, callback) {
    const checkSql = "SELECT COUNT(*) AS count FROM books";
    db.get(checkSql, (err, row) => {
        if (err) {
            console.error("Error checking data: " + err.message);
            callback(err);
            return;
        }

        if (row.count === 0) {
            console.log("➡️ Seeding initial book data...");
            const insert = 'INSERT INTO books (title, author, category, cover_url, rating, is_vip, description, publication_date, preview_content) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

            const booksData = [
                // Dữ liệu sách mẫu của bạn (đã loại bỏ để mã ngắn gọn, giữ nguyên trong file của bạn)
                ['Đắc Nhân Tâm', 'Dale Carnegie', 'Đọc nhiều', '/images/dacnhantam.jpg',
                    4.9, 0,
                    'Đắc Nhân Tâm (tên gốc: How to Win Friends and Influence People), là kiệt tác về kỹ năng sống của Dale Carnegie, một trong những cuốn sách bán chạy và có tầm ảnh hưởng lớn nhất mọi thời đại. "Đắc Nhân Tâm" theo nghĩa Hán Việt là "thu phục lòng người" bằng sự chân thành.',
                    '1936',
                    'Chương 1 của sách Đắc Nhân Tâm có tựa đề "Muốn lấy mật thì đừng phá tổ ong" (Nguyên tắc 1 của Phần I: Nghệ thuật ứng xử cơ bản) nhấn mạnh một quy tắc nền tảng tuyệt đối trong mọi mối quan hệ: Không chỉ trích, lên án hay than phiền người khác. Tác giả Dale Carnegie lập luận rằng chỉ trích là một hành động vô ích vì nó ngay lập tức đặt người nghe vào thế phòng thủ, khiến họ cảm thấy bị xúc phạm lòng tự trọng và nảy sinh sự oán giận, điều này hoàn toàn không dẫn đến sự thay đổi tích cực. Con người, theo bản năng, luôn tìm cách biện minh cho hành động của mình, thay vì tự nhận lỗi, do đó việc phê phán chỉ làm cho họ thêm cố chấp. Carnegie khuyến khích độc giả học hỏi từ những người thành công như Abraham Lincoln, người đã tự rèn luyện để thay đổi từ một người hay chỉ trích thành một người bao dung và thấu hiểu. Bài học chính rút ra là: Thay vì phán xét, chúng ta nên cố gắng thấu hiểu tại sao người khác hành động như vậy, vì sự thấu hiểu giúp ta bao dung hơn và tạo ra những kết quả lâu dài, tích cực hơn so với sự phê phán tiêu cực. Nói tóm lại, nguyên tắc đầu tiên để thu phục lòng người là hãy kiềm chế mong muốn chỉ trích, lên án hay than phiền.'],
                ['Doraemon Tập 44', 'Fujiko F. Fujio', 'Đọc nhiều', '/images/doraemon.jpg',
                    4.5, 0,
                    'Doraemon Tập 44 xoay quanh những rắc rối và hậu quả khôi hài khi Nobita cố gắng giải quyết các vấn đề cá nhân (như học tập, quan hệ với bạn bè, hay những trò nghịch ngợm hàng ngày) bằng cách lạm dụng các phát minh khoa học từ thế kỷ 22.',
                    '1969',
                    'Mở đầu Doraemon tập 44 có thể đề cập đến phim điện ảnh hoặc truyện ngắn với các nội dung khác nhau. Đối với Phim điện ảnh thứ 44 mang tên "Nobita và Cuộc Phiêu Lưu Vào Thế Giới Trong Tranh", nhóm bạn Doraemon đã sử dụng một bảo bối (có thể là chiếc đèn chiếu tranh) để bước vào thế giới được tạo ra từ những bức tranh, cụ thể là vương quốc Arturia thời Trung cổ, nơi họ gặp Công chúa Claire và phải cùng nhau chiến đấu chống lại các thế lực tà ác để bảo vệ thế giới nghệ thuật này khỏi nguy cơ tận diệt, đồng thời tôn vinh sức mạnh của sáng tạo và tình bạn. 44 là câu chuyện về chiếc máy "Làm Người Hùng Tức Thời"...'],
                ['Conan Tập 45', 'Aoyama Gōshō', 'Đọc nhiều', '/images/conan.jpg',
                    4.8, 0,
                    'Thám tử lừng danh Conan Tập 45 bao gồm các vụ án phức tạp, đáng chú ý nhất là việc Conan giải mã câu đố của Vermouth để tìm ra địa chỉ email liên lạc với Ông Trùm của Tổ chức Áo đen, mở ra manh mối quan trọng về kẻ đứng đầu.',
                    '1994',
                    'Tập truyện này tiếp nối những căng thẳng từ Tổ chức Áo đen khi Conan phải đối mặt với bí ẩn về địa chỉ email của Ông Trùm được Vermouth tiết lộ, đồng thời xử lý một loạt vụ án mới. Đáng chú ý là vụ án mạng của ngôi sao bóng chày đội Jaguars, một cầu thủ huyền thoại được mời phỏng vấn cùng thám tử Mori Kogoro. Vụ việc xảy ra bất ngờ ngay tại nơi phỏng vấn khi ngôi sao này bị sát hại, kéo theo Mori và cảnh sát vào cuộc điều tra. Conan, với sự quan sát tinh tường, nhanh chóng nhận ra các chi tiết bất thường liên quan đến thói quen và dụng cụ của nạn nhân. Cậu phát hiện hung thủ đã sử dụng một thủ đoạn tinh vi, khó lường, có thể liên quan đến một vật dụng cá nhân hoặc sơ suất để thực hiện hành vi đầu độc, tất cả bắt nguồn từ những mâu thuẫn hoặc sự ích kỷ cá nhân. Cuối cùng, Conan đã lợi dụng Mori để suy luận và vạch trần hung thủ cùng phương thức gây án, đưa vụ án đến hồi kết trong khi nỗi ám ảnh về Tổ chức Áo đen và sự theo dõi của Vermouth vẫn luôn rình rập Haibara và cậu.'],
                ['Fairy Tail Tập 54', 'Mashima Hiro', 'Đọc nhiều', '/images/fairytail54.jpg',
                    5.0, 0,
                    'Fairy Tail Tập 54 đánh dấu sự khởi đầu của một cuộc chiến khốc liệt khi Đế quốc Alvarez bắt đầu cuộc xâm lược quy mô lớn vào Magnolia, với mục tiêu nhắm vào Hội Fairy Tail và pháp thuật Fairy Heart...',
                    '2006',
                    'Tập 54 của Fairy Tail đóng vai trò là chương mở đầu cho Arc Đế quốc Alvarez, trong đó Hội Fairy Tail, dẫn đầu bởi Natsu, Lucy, Happy, Gray và Erza, bắt đầu thực hiện một chiến dịch táo bạo nhằm xâm nhập vào lãnh thổ của Đế quốc Alvarez (Z-Nation), nơi Hoàng đế Zeref trị vì. Mục tiêu cốt lõi của họ là tìm kiếm và đối đầu với Zeref để ngăn chặn ý đồ xâm lược Ishgar. Tuy nhiên, kế hoạch xâm nhập này nhanh chóng bị chặn đứng khi họ chạm trán với "12 Chiến Khiên" (Spriggan 12), đội quân tinh nhuệ gồm 12 pháp sư mạnh nhất, những cận thần trung thành của Hoàng đế Spriggan. Việc đụng độ sớm với những pháp sư được xem là mạnh nhất thế giới này ngay trên đường đi báo hiệu rằng cuộc chiến sắp tới sẽ vượt ra khỏi mọi quy mô trước đây và đầy rẫy hiểm nguy chết người.'],
                ['Nhà Giả Kim', 'Paulo Coelho', 'Sách', '/images/nhagiakim.jpg',
                    4.7, 0,
                    'Nhà Giả Kim của tác giả Paulo Coelho là một tiểu thuyết ngụ ngôn kể về hành trình theo đuổi "Bí mật cá nhân" của Santiago, một chàng chăn cừu trẻ tuổi ở Tây Ban Nha. Nội dung chính xoay quanh việc Santiago từ bỏ cuộc sống quen thuộc để thực hiện giấc mơ kỳ lạ lặp đi lặp lại về một kho báu ẩn giấu gần Kim tự tháp Ai Cập...',
                    '1988',
                    '"Nhà Giả Kim" kể về hành trình theo đuổi Truyền Thuyết Cá Nhân của Santiago, một chàng chăn cừu trẻ tuổi người Andalusia. Sau khi lặp lại giấc mơ về một kho báu được chôn giấu dưới chân Kim Tự Tháp ở Ai Cập, Santiago quyết định bán đàn cừu và lên đường. Trên đường đi, chàng gặp Melchizedek, một ông lão tự xưng là Vua Salem, người đã động viên chàng đi theo dấu hiệu vũ trụ và dạy chàng về Linh Hồn Vũ Trụ. Hành trình đưa Santiago qua châu Phi, nơi chàng bị lừa hết tiền, phải làm việc cho một người bán pha lê để kiếm sống. Tại đây, chàng học được bài học về sự kiên nhẫn và tầm quan trọng của việc sống với ước mơ. Tiếp tục cuộc hành trình qua sa mạc, chàng gặp được một cô gái Ả Rập tên Fatima và thấu hiểu tình yêu đích thực. Quan trọng hơn, chàng gặp Nhà Giả Kim, người trở thành người thầy tâm linh, hướng dẫn chàng lắng nghe trái tim và vượt qua những thử thách cuối cùng. Cuối cùng, Santiago nhận ra rằng kho báu thực sự không nằm ở Kim Tự Tháp mà là những trải nghiệm, bài học và sự trưởng thành có được trên suốt hành trình, và quan trọng hơn, kho báu vật chất lại nằm ngay tại chính nơi chàng đã mơ thấy nó - một nhà thờ đổ nát ở Tây Ban Nha, quê hương chàng. Cuốn sách là một thông điệp mạnh mẽ về việc tin vào ước mơ, lắng nghe trái tim và sự thật rằng khi bạn thực sự khao khát điều gì, cả vũ trụ sẽ hợp lực giúp bạn đạt được điều đó.'],
                ['Suối Nguồn', 'Ayn Rand', 'Sách', '/images/suoinguon.jpg',
                    4.6, 0,
                    'Nội dung chính là sự đối đầu không ngừng nghỉ giữa Roark – người chỉ sống vì “cái tôi” và đam mê sáng tạo nguyên bản của mình – với một xã hội bị thống trị bởi "những kẻ sống thứ sinh"...',
                    '1943',
                    'Suối Nguồn kể về cuộc đời của Howard Roark, một kiến trúc sư thiên tài, kiên quyết theo đuổi lý tưởng sáng tạo độc đáo và bất biến của mình, bất chấp sự phản đối và khinh miệt của xã hội và giới chuyên môn, những người tôn thờ sự sao chép và tầm thường. Anh liên tục phải đối đầu với Peter Keating, một đồng nghiệp tham vọng nhưng thiếu tài năng, luôn tìm cách luồn cúi và chạy theo ý kiến số đông để đạt được danh vọng; Ellsworth Toohey, một nhà phê bình kiến trúc quyền lực, kẻ thao túng dư luận và thù ghét những cá nhân xuất chúng; và cả Dominique Francon, một phụ nữ xinh đẹp, kiêu hãnh và cũng là người yêu của Roark, người vừa ngưỡng mộ vừa tìm cách hủy hoại anh vì cô tin rằng sự vĩ đại không thể tồn tại trong thế giới tầm thường. Xuyên suốt tác phẩm, Roark giữ vững lập trường "cái tôi vị kỷ" của người sáng tạo, chống lại "chủ nghĩa tập thể" và sự phụ thuộc, cuối cùng giành được thành công vang dội sau vụ nổ tung một công trình bị sửa đổi trái với thiết kế gốc của mình, khẳng định quyền được sống và sáng tạo vì chính bản thân.'],
                ['Đắc Nhân Tâm (Bản thường)', 'Dale Carnegie', 'Sách', '/images/dacnhantam.jpg',
                    4.9, 0,
                    'Đắc Nhân Tâm (tên gốc: How to Win Friends and Influence People), là kiệt tác về kỹ năng sống của Dale Carnegie, một trong những cuốn sách bán chạy và có tầm ảnh hưởng lớn nhất mọi thời đại. "Đắc Nhân Tâm" theo nghĩa Hán Việt là "thu phục lòng người" bằng sự chân thành.',
                    '1936',
                    'Chương 1 của sách Đắc Nhân Tâm có tựa đề "Muốn lấy mật thì đừng phá tổ ong" (Nguyên tắc 1 của Phần I: Nghệ thuật ứng xử cơ bản) nhấn mạnh một quy tắc nền tảng tuyệt đối trong mọi mối quan hệ: Không chỉ trích, lên án hay than phiền người khác. Tác giả Dale Carnegie lập luận rằng chỉ trích là một hành động vô ích vì nó ngay lập tức đặt người nghe vào thế phòng thủ, khiến họ cảm thấy bị xúc phạm lòng tự trọng và nảy sinh sự oán giận, điều này hoàn toàn không dẫn đến sự thay đổi tích cực. Con người, theo bản năng, luôn tìm cách biện minh cho hành động của mình, thay vì tự nhận lỗi, do đó việc phê phán chỉ làm cho họ thêm cố chấp. Carnegie khuyến khích độc giả học hỏi từ những người thành công như Abraham Lincoln, người đã tự rèn luyện để thay đổi từ một người hay chỉ trích thành một người bao dung và thấu hiểu. Bài học chính rút ra là: Thay vì phán xét, chúng ta nên cố gắng thấu hiểu tại sao người khác hành động như vậy, vì sự thấu hiểu giúp ta bao dung hơn và tạo ra những kết quả lâu dài, tích cực hơn so với sự phê phán tiêu cực. Nói tóm lại, nguyên tắc đầu tiên để thu phục lòng người là hãy kiềm chế mong muốn chỉ trích, lên án hay than phiền.'],
                ['Truyện Kiều', 'Nguyễn Du', 'Sách', '/images/truyenkieu.jpg',
                    4.9, 0,
                    'Tuyệt tác thơ Nôm, tác phẩm được viết bằng thể thơ lục bát truyền thống, gồm 3.254 câu, dựa trên cốt truyện Kim Vân Kiều truyện của Thanh Tâm Tài Nhân (Trung Quốc) nhưng đã được Nguyễn Du sáng tạo và thổi hồn Việt sâu sắc.',
                    'cuối thế kỷ XVIII - đầu thế kỷ XIX',
                    'Truyện Kiều kể về cuộc đời Vương Thúy Kiều, một thiếu nữ tài sắc vẹn toàn xuất thân từ gia đình trung lưu. Trong dịp du xuân, nàng gặp gỡ và đính ước với Kim Trọng. Tuy nhiên, biến cố bất ngờ ập đến: gia đình Kiều bị vu oan, cha bị bắt, buộc nàng phải bán mình chuộc cha và nhờ em là Thúy Vân nối duyên với Kim Trọng. Từ đó, Kiều bước vào mười lăm năm lưu lạc đầy đau khổ, bị bọn buôn người như Mã Giám Sinh, Tú Bà lừa gạt, đẩy vào chốn lầu xanh nhơ nhuốc. Nàng được Thúc Sinh chuộc ra làm vợ lẽ nhưng lại bị Hoạn Thư (vợ cả Thúc Sinh) ghen tuông, đày đọa. Kiều trốn thoát, nương nhờ cửa Phật rồi lại bị lừa bán vào chốn thanh lâu lần nữa. Tại đây, nàng gặp Từ Hải, một anh hùng hảo hán, và trở thành vợ chàng. Từ Hải giúp Kiều báo ân báo oán rồi bị Hồ Tôn Hiến lừa và tử trận. Kiều bị ép gả, quá đau khổ nên gieo mình xuống sông Tiền Đường tự vẫn nhưng may mắn được sư Giác Duyên cứu sống. Sau mười lăm năm, Kim Trọng cùng gia đình tìm được Kiều, và nàng trở về sum họp cùng gia đình. Kiều từ chối nối lại duyên vợ chồng với Kim Trọng để giữ trọn tình tri kỉ, kết thúc cuộc đời truân chuyên.'],
                ['Harry Potter', 'J. K. Rowling', 'Truyện', '/images/harrypotter.jpg',
                    5.0, 0,
                    'Harry Potter kể về hành trình của cậu bé phù thủy mồ côi Harry Potter sau khi biết mình là người sống sót duy nhất sau cuộc tấn công của Chúa tể Hắc ám Voldemort...',
                    '1997',
                    'Sau cái chết của cụ Dumbledore, Harry, Ron và Hermione quyết định không quay lại Hogwarts mà bắt đầu hành trình gian nan đi tìm và phá hủy những Trường Sinh Linh Giá còn lại của Voldemort. Thế giới phù thủy rơi vào hỗn loạn, Bộ Pháp thuật bị Tử thần Thực tử kiểm soát. Bộ ba lang thang khắp nơi, chiến đấu với sự truy lùng gắt gao, và đối mặt với sự cám dỗ của Bảo Bối Tử Thần (Đũa phép Cơm Nguội, Hòn đá Phục Sinh và Áo khoác Tàng Hình). Họ khám phá ra bí mật về quá khứ của Dumbledore và biết được sự thật gây sốc qua ký ức của Severus Snape: Snape luôn yêu mẹ Harry, Lily, và là điệp viên hai mang của Dumbledore. Harry cũng nhận ra mình chính là Trường Sinh Linh Giá vô tình cuối cùng chứa đựng một mảnh linh hồn của Voldemort. Trong Trận chiến Hogwarts cuối cùng, Harry tự nguyện đi vào rừng cấm, chấp nhận cái chết dưới tay Voldemort để tiêu diệt mảnh hồn trong mình. Tuy nhiên, nhờ bùa bảo vệ từ máu mẹ cậu, Harry sống sót. Sau khi Nagini (Trường Sinh Linh Giá cuối cùng) bị Neville Longbottom tiêu diệt, Harry đối mặt với Voldemort. Harry giải thích rằng Cây Đũa phép Cơm Nguội đã thuộc về cậu. Khi Voldemort dùng lời nguyền Giết Chóc lần cuối, cây đũa từ chối chủ nhân cũ. Lời nguyền dội ngược, Voldemort bị tiêu diệt hoàn toàn. Cuốn truyện kết thúc với cảnh Harry, Ron và Hermione sống hạnh phúc 19 năm sau, tiễn con cái họ đến Hogwarts.'],
                ['Dragon Ball Tập 13', 'Akira Toriyama', 'Truyện', '/images/dragonball.jpg',
                    4.9, 0,
                    'Cuốn sách này tiếp tục câu chuyện sau Đại hội Võ thuật lần thứ 22. Goku, cùng với những người bạn thân thiết, phải đối mặt với một mối đe dọa tàn khốc và đen tối nhất từ trước đến nay: Đại Ma Vương Piccolo trở lại...',
                    '1984',
                    'Sau khi kết thúc Đại hội Võ thuật Thế giới lần thứ 22 với chiến thắng sát nút trước Thiên Xin Hăng (Tenshinhan), tưởng chừng như Son Goku có thể tận hưởng bình yên, nhưng thời khắc đó nhanh chóng bị thay thế bằng nỗi kinh hoàng tột độ. Mối đe dọa lớn nhất xuất hiện: Đại Ma Vương Piccolo—một ác nhân cổ xưa, hiện thân của cái ác thuần túy—đã tái xuất. Nhờ điều ước từ Ngọc Rồng, Piccolo đã lấy lại được tuổi thanh xuân và đạt được một sức mạnh vượt trội, trở nên nguy hiểm gấp bội. Hắn không chỉ đơn thuần tìm cách trả thù, mà còn tuyên bố chinh phục thế giới một cách công khai và tàn bạo, bay thẳng đến cung điện của Quốc Vương Thế giới, tự phong mình làm tân vương và truyền bá chế độ khủng bố qua sóng truyền hình toàn cầu. Sự xuất hiện của Piccolo gieo rắc nỗi sợ hãi, giết hại các chiến binh mạnh nhất và khủng bố người dân vô tội. Trước hiểm họa này, Goku nhận ra đây là một cuộc chiến sinh tử quyết định vận mệnh nhân loại. Để có thể đối chọi với sức mạnh vô song của kẻ thù đã phục hồi tuổi xuân, Goku buộc phải thực hiện một hành động liều lĩnh nhất: tìm kiếm Siêu Thánh Thủy, một loại nước huyền thoại có thể ban tặng sức mạnh phi thường nhưng cũng đi kèm với cái chết nếu người uống không đủ ý chí. Tình thế của Trái Đất trở nên ngàn cân treo sợi tóc, khi Goku, người anh hùng cuối cùng, phải chấp nhận đặt cược mạng sống của mình để có hy vọng chặn đứng sự thống trị khủng khiếp của Đại Ma Vương Piccolo.'],
                ['Doraemon Tập 44', 'Fujiko F. Fujio', 'Truyện', '/images/doraemon.jpg',
                    4.5, 0,
                    'Doraemon Tập 44 xoay quanh những rắc rối và hậu quả khôi hài khi Nobita cố gắng giải quyết các vấn đề cá nhân (như học tập, quan hệ với bạn bè, hay những trò nghịch ngợm hàng ngày) bằng cách lạm dụng các phát minh khoa học từ thế kỷ 22.',
                    '1969',
                    'Mở đầu Doraemon tập 44 có thể đề cập đến phim điện ảnh hoặc truyện ngắn với các nội dung khác nhau. Đối với Phim điện ảnh thứ 44 mang tên "Nobita và Cuộc Phiêu Lưu Vào Thế Giới Trong Tranh", nhóm bạn Doraemon đã sử dụng một bảo bối (có thể là chiếc đèn chiếu tranh) để bước vào thế giới được tạo ra từ những bức tranh, cụ thể là vương quốc Arturia thời Trung cổ, nơi họ gặp Công chúa Claire và phải cùng nhau chiến đấu chống lại các thế lực tà ác để bảo vệ thế giới nghệ thuật này khỏi nguy cơ tận diệt, đồng thời tôn vinh sức mạnh của sáng tạo và tình bạn. 44 là câu chuyện về chiếc máy "Làm Người Hùng Tức Thời"...'],
                ['Conan Tập 45', 'Aoyama Gōshō', 'Truyện', '/images/conan.jpg',
                    4.8, 0,
                    'Thám tử lừng danh Conan Tập 45 bao gồm các vụ án phức tạp, đáng chú ý nhất là việc Conan giải mã câu đố của Vermouth để tìm ra địa chỉ email liên lạc với Ông Trùm của Tổ chức Áo đen, mở ra manh mối quan trọng về kẻ đứng đầu.',
                    '1994',
                    'Tập truyện này tiếp nối những căng thẳng từ Tổ chức Áo đen khi Conan phải đối mặt với bí ẩn về địa chỉ email của Ông Trùm được Vermouth tiết lộ, đồng thời xử lý một loạt vụ án mới. Đáng chú ý là vụ án mạng của ngôi sao bóng chày đội Jaguars, một cầu thủ huyền thoại được mời phỏng vấn cùng thám tử Mori Kogoro. Vụ việc xảy ra bất ngờ ngay tại nơi phỏng vấn khi ngôi sao này bị sát hại, kéo theo Mori và cảnh sát vào cuộc điều tra. Conan, với sự quan sát tinh tường, nhanh chóng nhận ra các chi tiết bất thường liên quan đến thói quen và dụng cụ của nạn nhân. Cậu phát hiện hung thủ đã sử dụng một thủ đoạn tinh vi, khó lường, có thể liên quan đến một vật dụng cá nhân hoặc sơ suất để thực hiện hành vi đầu độc, tất cả bắt nguồn từ những mâu thuẫn hoặc sự ích kỷ cá nhân. Cuối cùng, Conan đã lợi dụng Mori để suy luận và vạch trần hung thủ cùng phương thức gây án, đưa vụ án đến hồi kết trong khi nỗi ám ảnh về Tổ chức Áo đen và sự theo dõi của Vermouth vẫn luôn rình rập Haibara và cậu.'],
                ['Fairy Tail Tập 54', 'Mashima Hiro', 'Truyện', '/images/fairytail54.jpg',
                    5.0, 0,
                    'Fairy Tail Tập 54 đánh dấu sự khởi đầu của một cuộc chiến khốc liệt khi Đế quốc Alvarez bắt đầu cuộc xâm lược quy mô lớn vào Magnolia, với mục tiêu nhắm vào Hội Fairy Tail và pháp thuật Fairy Heart...',
                    '2006',
                    'Tập 54 của Fairy Tail đóng vai trò là chương mở đầu cho Arc Đế quốc Alvarez, trong đó Hội Fairy Tail, dẫn đầu bởi Natsu, Lucy, Happy, Gray và Erza, bắt đầu thực hiện một chiến dịch táo bạo nhằm xâm nhập vào lãnh thổ của Đế quốc Alvarez (Z-Nation), nơi Hoàng đế Zeref trị vì. Mục tiêu cốt lõi của họ là tìm kiếm và đối đầu với Zeref để ngăn chặn ý đồ xâm lược Ishgar. Tuy nhiên, kế hoạch xâm nhập này nhanh chóng bị chặn đứng khi họ chạm trán với "12 Chiến Khiên" (Spriggan 12), đội quân tinh nhuệ gồm 12 pháp sư mạnh nhất, những cận thần trung thành của Hoàng đế Spriggan. Việc đụng độ sớm với những pháp sư được xem là mạnh nhất thế giới này ngay trên đường đi báo hiệu rằng cuộc chiến sắp tới sẽ vượt ra khỏi mọi quy mô trước đây và đầy rẫy hiểm nguy chết người.'],
            ];

            // Sử dụng Promise.all để đảm bảo tất cả INSERT hoàn thành
            const insertPromises = booksData.map(book => {
                return new Promise((resolve, reject) => {
                    db.run(insert, book, function (err) {
                        if (err) {
                            console.error(`Error inserting book: ${book[0]} - ${err.message}`);
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
            });

            Promise.all(insertPromises)
                .then(() => {
                    console.log("✅ Initial book data seeding complete. Descriptions and previews updated.");
                    callback(null, db);
                })
                .catch(err => {
                    callback(err);
                });

        } else {
            console.log("✅ Database already has data. Skipping seeding.");
            callback(null, db);
        }
    });
}

// Hàm khởi tạo chính
function initializeDatabase(callback) {
    const db = new sqlite3.Database(dbFile, (err) => {
        if (err) {
            console.error("❌ Lỗi kết nối database: " + err.message);
            return callback(err);
        }
        console.log('✅ Database connected: book_store.db');

        // 1. Tạo bảng BOOKS
        db.run(`CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT,
            category TEXT,
            cover_url TEXT NOT NULL,
            rating REAL,
            is_vip BOOLEAN DEFAULT 0,
            description TEXT,
            publication_date TEXT, 
            preview_content TEXT
        )`, (err) => {
            if (err) {
                console.error("❌ Lỗi tạo bảng books: " + err.message);
                return callback(err);
            }
            console.log('✅ Books table ensured.');

            // 2. Tạo bảng USERS
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`, (err) => {
                if (err) {
                    console.error("❌ Lỗi tạo bảng users: " + err.message);
                    return callback(err);
                }
                console.log('✅ Users table ensured.');

                // 3. ⭐ TẠO BẢNG COMMENTS (Bình luận) ⭐
                db.run(`
                    CREATE TABLE IF NOT EXISTS comments (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        book_id INTEGER NOT NULL,
                        user TEXT NOT NULL,
                        text TEXT NOT NULL,
                        date TEXT NOT NULL,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
                    )
                `, (err) => {
                    if (err) {
                        console.error("❌ Lỗi tạo bảng comments: " + err.message);
                        return callback(err);
                    }
                    console.log('✅ Comments table ensured.');

                    // Chèn dữ liệu sách mẫu sau khi tất cả bảng đã sẵn sàng
                    seedBookData(db, callback);
                });
            });
        });
    });

    // Xử lý đóng database khi server tắt (giữ nguyên)
    process.on('SIGINT', () => {
        db.close((err) => {
            if (err) {
                console.error("Error closing database: " + err.message);
            } else {
                console.log('\nDatabase connection closed.');
            }
            process.exit(0);
        });
    });
}

// Xuất hàm khởi tạo
module.exports = initializeDatabase;