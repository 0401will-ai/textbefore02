$(function () {
    /* =========================================================
     會員登入
     用單一登入狀態管理所有需要會員權限的功能。
     真正網站必須由伺服器驗證帳密，不能只靠瀏覽器變數保護資料。
  ========================================================== */
    let isLoggedIn = false;

    // 共用 Toast 模組：自動建立容器、安全插入文字，並在動畫結束後清理節點。
    const App = {
        toast(message, type = "success", delay = 2200) {
            const allowedTypes = ["success", "danger", "primary", "warning", "info", "secondary", "dark"];
            const safeType = allowedTypes.includes(type) ? type : "success";
            let $container = $(".app-toast-container");
            if (!$container.length) {
                $container = $('<div class="app-toast-container toast-container position-fixed bottom-0 end-0 me-5 p-3"></div>')
                    .appendTo("body");
            }
            const $toast = $(`
        <div class="toast text-bg-${safeType} border-0 shadow" role="status" aria-live="polite" aria-atomic="true" style="--bs-toast-max-width: 300px;">
          <div class="d-flex align-items-center">
            <div class="toast-body"></div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="關閉"></button>
          </div>
        </div>
      `).appendTo($container);
            // .text() treats messages as plain text and prevents accidental HTML injection.
            $toast.find(".toast-body").text(message);
            const toastInstance = new bootstrap.Toast($toast[0], { delay });
            $toast.one("hidden.bs.toast", () => $toast.remove());
            toastInstance.show();
        }
    };
    // 權限檢查的共用入口：未登入時提示，並中止呼叫端的操作。
    function requireLogin() {
        if (isLoggedIn) return true;
        App.toast("請先登入會員，才能使用這項功能。", "danger");
        $(".login_btn").addClass("fa-beat ");
        setTimeout(() => {
            $(".login_btn").removeClass("fa-beat");
        }, 2000);
        $("#l").modal("show");
        let ttt = 3; 
const time = setInterval(() => {    
     if (!$("#l").hasClass("show")) {
        clearInterval(time);
        $(".sec").text(3);
        return;
    }
    ttt--;
    if (ttt >= 0) {
        $(".sec").text(ttt);
    }else {
        $("#l").modal("hide");
        $("#login").modal("show");
        setTimeout(() => {            
            $(".sec").text(3);        
        }, 150);
    }
}, 1000);
        return false;
    }

    function setLoginState(loggedIn) {
        isLoggedIn = loggedIn;
        // 登入狀態同步控制客服輸入欄和送出按鈕，登出後立即清空未送出的內容。
        $("#userInput, #sendMsgBtn").prop("disabled", !loggedIn);
        if (!loggedIn) $("#userInput").val("");
        $("#userInput").attr("placeholder", loggedIn ? "請輸入訊息..." : "請先登入會員");
        const $loginButton = $(".login_btn");
        if (loggedIn) {
            $loginButton.removeClass("btn-primary").addClass("btn-success")
                .html('<i class="fa-solid fa-user-circle me-1"></i>登出');
            App.toast("登入成功！歡迎回來。", "success");
        } else {
            $loginButton.removeClass("btn-success").addClass("btn-primary")
                .html('<i class="fa-solid fa-user-circle me-1"></i>登入');
            App.toast("您已登出，期待下次再見！", "secondary");
        }
    }

    // 登入按鈕依目前狀態開啟登入視窗或執行登出。
    $(".login_btn").on("click", function () {
        if (isLoggedIn) {
            setLoginState(false);
            return;
        }
        bootstrap.Modal.getOrCreateInstance(document.getElementById("login")).show();
    });

    // 正式網站需串接 Google OAuth 與後端驗證。
    $("#googleLogin").on("click", function () {
        setLoginState(true);
        bootstrap.Modal.getOrCreateInstance(document.getElementById("login")).hide();
    });

    /* =========================================================
     Navbar Scroll
     監聽網頁捲動事件
  ========================================================== */
    $(window).on("scroll", function () {
        const $h = $(".header");
        const $h2 = $(".header2");
        const a = this.scrollY > 10;
        const aa = this.scrollY > 500;
        $h
            .toggleClass("a1", a)
            .toggleClass("a2", !a);
        if (aa) {
            $("#backTop").fadeIn(500);
        } else {
            $("#backTop").fadeOut(500);
        }
    }).trigger("scroll");
    //   $(window).on("scroll", function () {
    //     // 取得目前網頁垂直捲動的位置
    //     const $scrollTop = $(this).scrollTop();
    //     const $secHi = $("#sec1").outerHeight();

    //     // 當網頁向下捲動超過 50px
    //     // Navbar 加上 .scrolled class
    //     if ($scrollTop > $secHi) {
    //       $("#mainNav").addClass("scrolled");
    //     } else {
    //       // 回到 50px 以內時，移除 .scrolled class
    //       $("#mainNav").removeClass("scrolled");
    //     }

    //     /* Back To Top */
    //     // 當網頁向下捲動超過 500px
    //     // 顯示 Back To Top 按鈕
    //     if ($scrollTop > 500) {
    //       $("#backTop").fadeIn(300, function () {
    //         // 保留工具列按鈕的 Grid 置中排版。
    //         $(this).css("display", "grid");
    //       });
    //     } else {
    //       // 回到 500px 以內時
    //       // 隱藏 Back To Top 按鈕
    //       $("#backTop").fadeOut(300);
    //     }
    //   });
    /* =========================================================
     Back To Top
     點擊按鈕後，平滑回到網頁最上方
  ========================================================== */
    $(".header2").on("click", function () {
        $("html, body").animate({ scrollTop: 0 }, 700);
    });
    //   $("#backTop").on("click", function () {
    //     // 使用 animate() 製作平滑滾動效果
    //     $("html, body").animate(
    //       {
    //         // 將網頁捲動位置設定為 0
    //         scrollTop: 0
    //       },
    //       // 動畫時間：700 毫秒
    //       700
    //     );
    //   });
    /* =========================================================
     Navbar Smooth Scroll
     Navbar 點擊後，平滑捲動到指定 Section
  ========================================================== */
    // // 找出 Navbar 裡面 href 是 # 開頭的連結
    // $('.navbar a[href^="#"]').on("click", function (e) {
    //     // 取得目前點擊連結的 href
    //     // 例如 href="#about"，target 就會是 "#about"
    //     const target = $(this).attr("href");
    //     // 確認指定的 Section 是否存在
    //     if ($(target).length) {
    //         // 阻止瀏覽器原本直接跳轉到錨點的行為
    //         e.preventDefault();
    //         // 使用 animate() 製作平滑捲動
    //         $("html, body").animate(
    //             {
    //                 // 捲動到指定 Section
    //                 // -70 是預留 Navbar 的高度
    //                 scrollTop: $(target).offset().top - 70
    //             },
    //             // 動畫時間：650 毫秒
    //             650
    //         );
    //     }
    //     // Bootstrap Navbar 在手機版點擊後自動收合
    //     const menuElement = document.querySelector(".navbar-collapse");
    //     if (menuElement) bootstrap.Collapse.getOrCreateInstance(menuElement).hide();
    // });
    /* =========================================================
     Scroll Reveal
     當元素進入畫面時，加入 .show 顯示動畫
  ========================================================== */
    function r() {
        $(".resveal , .resveal1 , .resveal2 , .resveal3 , .resveal4 , .resveal5 , .resveal6 , .resveal7 , .resveal8 , .resveal9 , .resveal10").each(function () {
            const tot = $(this).offset().top;
            const wstwh = $(window).scrollTop() + $(window).height();
            if (tot < wstwh - 50) {
                $(this).addClass("r-show");
            } else {
                $(this).removeClass("r-show");
            }
        });
    }
    $(window).on("scroll load", r);
    // function revealElements() {
    //     // 找出所有帶有 .reveal class 的元素
    //     $(".reveal").each(function () {
    //         // 取得目前元素距離網頁頂端的位置
    //         const elementTop = $(this).offset().top;
    //         // 計算目前瀏覽器視窗底部的位置
    //         // scrollTop = 已經捲動的距離
    //         // height = 瀏覽器視窗高度
    //         const windowBottom = $(window).scrollTop() + $(window).height();
    //         // 當瀏覽器視窗底部
    //         // 超過元素頂端 80px 時
    //         // 代表元素已經接近進入畫面
    //         if (windowBottom > elementTop + 80) {
    //             // 加上 .show class
    //             // CSS 可以利用 .show 製作淡入、上移等動畫
    //             $(this).addClass("show");
    //         }
    //     });
    // }
    // // 呼叫 revealElements
    // // $(window).on("scroll", function () {
    // //   revealElements();
    // // });
    // $(window).on("scroll load", revealElements);
    /* =========================================================
     carousel-progress
  ========================================================== */
    // const $carousel = $("#banner");
    // const $progressBar = $(".carousel-progress .progress-bar");

    // function startProgressBar() {
    //     // 取得當前輪播項目的 data-bs-interval，預設為 2000 ms
    //     const interval = parseInt($carousel.find(".carousel-item.active").data("bs-interval"), 10) || 2000;

    //     // 清空動畫佇列、重置寬度為 0%，並播放進度條動畫
    //     $progressBar
    //         .stop(true, true)
    //         .css("width", "0%")
    //         .animate({ width: "100%" }, interval, "linear");
    // }
    // // 1. 初始化執行第一張幻燈片的進度條
    // startProgressBar();

    // // 2. 監聽 Bootstrap Carousel 切換事件（切換完成時觸發）
    // $carousel.on("slid.bs.carousel", startProgressBar);

    /* =========================================================
     Counter Animation
  ========================================================== */
    function num() {
        const $ns = $(".numbers");
        if ($ns.length === 0) {
            return;
        }
        const tot = $ns.offset().top;
        const wstwh = $(window).scrollTop() + $(window).height();
        if (tot < wstwh) {
            const $num = $ns.find(".num");
            $num.each(function () {
                const $n = $(this);
                const $nd = $n.data("num");
                $({ number: 0 }).animate({ number: $nd }, {
                    duration: 4000,
                    step: function () {
                        $n.text(Math.floor(this.number));
                    },
                    complete: function () {
                        $n.text($nd);
                    }
                });
            }
            );
            $(window).off("scroll load", num);
        }
    }
    $(window).on("scroll load", num);

    // let $counterStarted = false;

    // function startCounter() {
    //     if ($("#O_N").length === 0) {
    //         return;
    //     }

    //     const $data = $("#O_N");
    //     const $dataTop = $data.offset().top;
    //     const $dataBottom = $dataTop + $data.outerHeight(); // Data 區塊底部位置

    //     const $windowScrollTop = $(window).scrollTop();
    //     const $windowHeight = $(window).height();
    //     const $screenBottom = $windowScrollTop + $windowHeight; // 螢幕底部位置

    //     // =======================================================
    //     // 判斷 Data 區塊是否「在螢幕畫面中」
    //     //
    //     // 1. 螢幕底部 > 區塊頂部（代表從上方滾入）
    //     // 2. 螢幕頂部 < 區塊底部（代表尚未完全滾出上方）
    //     // =======================================================
    //     const isInView = $screenBottom > $dataTop && $windowScrollTop < $dataBottom;

    //     // 進入畫面 且 目前尚未播放動畫 → 開始播放
    //     if (isInView && !$counterStarted) {
    //         $counterStarted = true;

    //         // 1. 數字動畫
    //         $(".counter").each(function () {
    //             const $counter = $(this);
    //             const $target = $counter.data("target");

    //             // 停止前一次尚未結束的動畫並重置為 0
    //             $({ number: 0 })
    //                 .stop(true, true)
    //                 .animate(
    //                     { number: $target },
    //                     {
    //                         duration: 1800,
    //                         step: function () {
    //                             $counter.text(Math.floor(this.number));
    //                         },
    //                         complete: function () {
    //                             $counter.text($target);
    //                         }
    //                     }
    //                 );
    //         });

    //     }
    //     // 離開畫面 且 動畫先前有播放過 → 歸零重置
    //     else if (!isInView && $counterStarted) {
    //         $counterStarted = false;

    //         // 重置數字為 0
    //         $(".counter").each(function () {
    //             $(this).stop(true, true).text("0");
    //         });
    //     }
    // }

    // $(window).on("load scroll", startCounter);
    // ==========================================
    // 購物車
    // ==========================================
    const cart = [];

    $(".add-to-cart").on("click", function () {
        // 未登入時不變更庫存，也不加入購物車。
        if (!requireLogin()) return;
        const product = $(this).closest(".product");
        const productName = product.find(".PR-name").text();
        const productPrice = parseFloat(
            product.find(".PR-price").text().replace("NT$", "")
        );
        const productImage = product.find(".PR-img").attr("src");

        // 獲取庫存剩餘量直接從 PR-stock span 中
        const stockSpan = product.find(".PR-stock");
        let stockLeft = parseInt(stockSpan.text(), 10);

        // 檢查庫存是否為 0
        if (stockLeft === 0) {
            alert("剩餘位置不足");
            return; // 不執行後續加入購物車的操作
        }

        // 加入購物車的動畫效果
        $(".shopping-cart").addClass("fa-shake");
        setTimeout(() => {
            $(".shopping-cart").removeClass("fa-shake");
        }, 500);

        // 透過共用 Toast 模組顯示加入成功提示。
        App.toast("已加入購物車", "primary");

        // 檢查購物車內是否已有此商品
        const existingItem = cart.find((item) => item.name === productName);

        if (existingItem) {
            // 前面已確認尚有庫存，因此直接增加購物車數量。
            existingItem.quantity++;
            stockLeft--; // 同步扣除剩餘庫存
        } else {
            // 如果商品不在購物車中，添加新的購物車項目
            cart.push({
                name: productName,
                price: productPrice,
                quantity: 1,
                image: productImage,
            });
            stockLeft--; // 減少庫存
        }

        // 更新庫存顯示在 PR-stock span 中
        stockSpan.text(stockLeft);

        // 更新購物車內容
        updateCart();
    });

    function updateCart() {
        const cartItems = $(".cart-items");
        const cartTotal = $(".cart-total");
        const cartQuantity = $(".cart-quantity");

        cartItems.empty();
        let total = 0;
        let quantity = 0;

        if (cart.length === 0) {
            cartItems.append('<li class="cart-empty">日程還沒有規劃，去報名你想參加的吧！</li>');
        }

        for (const item of cart) {
            // 用 jQuery 建立節點並以 .text() 填文字，避免字串插入 HTML。
            const $row = $(
                '<li class="cart-item-card list-group-item">' +
                '<div class="cart-item-image-wrap"><img class="cart-item-image" alt=""></div>' +
                '<div class="cart-item-info"><h6 class="cart-item-name"></h6>' +
                '<span class="cart-item-quantity"></span></div>' +
                '<strong class="cart-item-price"></strong>' +
                '</li>'
            );
            $row.find(".cart-item-image").attr({ src: item.image, alt: item.name });
            $row.find(".cart-item-name").text(item.name);
            $row.find(".cart-item-quantity").text(`人數：${item.quantity}`);
            $row.find(".cart-item-price").text(`NT$${item.price * item.quantity}`);
            cartItems.append($row);
            total += item.price * item.quantity;
            quantity += item.quantity;
        }

        cartTotal.text(`NT$${total.toFixed(2)}`);
        cartQuantity.text(quantity);
    }

    $(".shopping-cart").on("click", function () {
        // 移除 HTML 上的自動開窗屬性，確定登入後才開啟購物車。
        if (!requireLogin()) return;
        bootstrap.Modal.getOrCreateInstance(document.getElementById("Checkout")).show();
    });

    $(".checkout-button").on("click", function () {
        if (!requireLogin()) return;
        if (cart.length === 0) {
            App.toast("請先報名再確定。", "warning");
            return;
        }
        cart.length = 0;
        updateCart();
        bootstrap.Modal.getOrCreateInstance(document.getElementById("Checkout")).hide();
        bootstrap.Modal.getOrCreateInstance(document.getElementById("ok")).show();
    });

    // =========================
    // 留言板
    // =========================

    const msgData = [
        {
            name: "台北李宇春",
            text: "珍惜",
            likes: 1212
        },
    ];

    //  取得元素

    const $name = $("#name");
    const $content = $("#neirong");
    const $list = $(".message-list");
    // const $count = $("#messageCount");

    // // 更新留言數量

    // function updateCount() {
    //     $count.text(msgData.length);
    // }
    // XSS 防護

    function escapeHtml(text) {
        return $("<div>").text(text).html();
    }
    // 建立留言

    function createMessage(data) {
        // 頭像第一個字
        const avatar = data.name.charAt(0);

        // 隨機左右位置
        const left = Math.floor(Math.random() * 80) + 5;

        // 隨機左右移動
        const move = Math.random() * 160 - 80 + "px";

        // 隨機漂浮速度
        const duration = Math.random() * 15 + 5 + "s";

        // 建立留言卡片
        const $msgTpl = $(`
    <div class="message-item float card pa rounded-4 msg p-3 d-fxcc jcs bg-wt blur z-1"
      style="
        --left: ${left}%;
        --move: ${move};
        --duration: ${duration};
      ">      
      <div class="d-fxcc jcs w-100">
      <div class="rounded-pill d-fxcc shadow-sm" style="width:30px; height:30px;">
        ${escapeHtml(avatar)}
      </div>
          <div class="ps-1">
            <strong >${escapeHtml(data.name)}</strong>
            <div class="message-time" style="transform: scale(0.8);">
              剛剛
            </div>
          </div>
        
        </div>
        <p class="w-100 m-0">
          ${escapeHtml(data.text)}
        </p>
        <div class="d-fxcc jce w-100">
                  <button type="button" class="btn message-like border-0 t-bt">
            <i class="fa-solid fa-heart"></i>
            <span>${data.likes}</span>
          </button>  
      </div>
    </div>
  `);

        // 加入留言列表
        $list.append($msgTpl);

        // 動畫完成後移除畫面上的留言
        $msgTpl.one("animationend", function () {
            $(this).remove();
        });
    }

    // 初始留言

    msgData.forEach(function (message, index) {
        setTimeout(function () {
            createMessage(message);
        }, index * 700);
    });

    // 持續隨機產生留言

    setInterval(function () {
        // 從 msgData 隨機取得一筆
        const randomMessage = msgData[Math.floor(Math.random() * msgData.length)];

        // 建立漂浮留言
        createMessage({
            name: randomMessage.name,
            text: randomMessage.text,
            likes: randomMessage.likes
        });
    }, 2200);
    function msg() {

        // 留言板互動需先登入。
        if (!requireLogin()) return;
        // 取得輸入內容
        const name = $name.val().trim();
        const content = $content.val().trim();

        // 表單驗證
        let valid = true;

        // 暱稱

        if (!name) {
            $name.addClass("is-invalid");

            valid = false;
        } else {
            $name.removeClass("is-invalid");
        }

        // 留言

        if (!content) {
            $content.addClass("is-invalid");

            valid = false;
        } else {
            $content.removeClass("is-invalid");
        }

        // 驗證失敗
        if (!valid) return;
        // 建立新留言資料

        const newMessage = {
            name: name,
            text: content,
            likes: 0,
            time: "剛剛"
        };
        // 加入留言資料

        msgData.push(newMessage);

        // 顯示新留言

        createMessage(newMessage);

        // 更新留言數量

        // updateCount();

        // 清空輸入框

        $name.val("");
        $content.val("");

        // 移除錯誤狀態

        $name.removeClass("is-invalid");
        $content.removeClass("is-invalid");

        // 游標回到暱稱

        // $name.focus();

    }
    $name.keypress(function (e) {
        if (e.which === 13) $content.focus();;
        if (e.which === 39) $content.focus();;
    });
    $content.keypress(function (e) {
        if (e.which === 13) msg();
    });

    $(".btn-send").on("click", function () {
        msg();
    });
    // 按讚

    $list.on("click", ".message-like", function () {
        // 按讚也屬於留言板互動，未登入時不更新愛心數量。
        if (!requireLogin()) return;
        // 目前按讚按鈕
        const $btn = $(this);

        // 愛心圖示
        const $icon = $btn.find("i");

        // 愛心數量
        const $num = $btn.find("span");

        // 取得目前愛心數量
        let num = parseInt($num.text(), 10);

        // 取消讚

        if ($btn.hasClass("liked")) {
            num--;

            $btn.removeClass("liked");

            $icon.removeClass("fa-solid").addClass("fa-regular");
        }

        // 按讚
        else {
            num++;

            $btn.addClass("liked");

            $icon.removeClass("fa-regular").addClass("fa-solid");

            // 愛心跳動動畫
            $icon.addClass("fa-bounce");

            // 1 秒後停止動畫
            setTimeout(function () {
                $icon.removeClass("fa-bounce");
            }, 1000);
        }

        // 更新愛心數量
        $num.text(num);
    });

    // 網頁載入時更新留言數量

    // updateCount();

    // ==========================================
    // 機器人
    // ==========================================
    // 開關機器人
    $(".AIxBotBtn").on("click", function () {
        // 客服視窗包含可輸入訊息的功能，因此開啟前先確認登入狀態。
        if (!requireLogin()) return;
        $(".AIxBot").fadeToggle(400);
    });

    // 點擊快速選單
    $(".r_btn").click(function () {
        if (!requireLogin()) return;
        let id = $(this).data("id");
        let title = $(this).text().trim();

        userMsg(`${title}！`);
        setTimeout(() => {
            aiMsg(`已將頁面跳回 ${title}！`);
            $("html, body").animate({ scrollTop: $(`#s${id}`).offset().top }, 800);
        }, 600);
    });
    //======= 傳送訊息（關鍵字回覆）
    $("#sendMsgBtn").on("click", sendMsg);
    $("#userInput").keypress(function (e) {
        if (e.which === 13) sendMsg();
    });

    function sendMsg() {
        if (!requireLogin()) return;
        let msg = $("#userInput").val().trim();
        if (!msg) return;
        userMsg(msg);
        $("#userInput").val("");
        setTimeout(function () {
            aiMsg(getResponse(msg.toLowerCase()));
        }, 200);
        // ES6 寫法
        // setTimeout(() => aiMsg(getResponse(msg.toLowerCase())), 200);
    }

    // === 關鍵字回應對照表 ===
    function getResponse(input) {
        let responses = {
            你好: "你好！有什麼可以幫助您嗎？",
            hi: "Hi！有什麼可以幫助您嗎？",
            hello: "Hello！有什麼可以幫助您嗎？",
            課程: "這是我們的課程介紹頁面 👉 [點我查看]",
            服務: "若有問題請至客服中心留言，我們將迅速為您處理！",
            電話: "聯絡資訊：0933-048-583",
            金手: "乾你屁事",
            buy: "就是買東西。",
            text: "想要跟我來一場考試?",
            yes: "我no",
            想: "我不想",
            想要: "我不想",
        };

        // 如果輸入的字不在上面對照表中，就回預設訊息
        return responses[input] || "抱歉，我暫時不太明白您的問題。";
    }
    //======= 傳送訊息 End

    // 使用者訊息
    function userMsg(text) {
        const $message = $('<div class="d-flex justify-content-end"><div class="AxBox text-bg-primary p-2 h6"></div></div>');
        $message.find(".AxBox").text(text).append('<i class="fa-solid fa-user ms-1"></i>');
        $(".BotxMag").append($message);
        scrollToBottom();
    }

    // 機器人訊息
    function aiMsg(text) {
        const $message = $('<div class="QxBox text-bg-dark p-2 h6"><i class="fa-solid fa-robot me-1"></i></div>');
        $message.append(document.createTextNode(text));
        $(".BotxMag").append($message);
        scrollToBottom();
    }

    // 自動捲到底部
    function scrollToBottom() {
        $(".BotxMag").scrollTop($(".BotxMag")[0].scrollHeight);
    }





    let ac = 0;
    const $cards = $(".card3d");
    const cs = $cards.length;
    // 🚀 核心矩陣演算法：高精算每一張卡片在三維空間中的 X軸側移、Z軸景深深度與角度偏轉
    function card3d() {
        $cards.each(function () {
            const $card = $(this);
            const cardIndex = parseInt($card.attr("data-index"), 10);
            // 計算當前卡片相對於選中核心卡片的時空差值距離
            let offset = cardIndex - ac;
            // 處理環形無限循環邊界拓撲
            if (offset < -2) offset += cs;
            if (offset > 2) offset -= cs;
            $card.removeClass("active");
            // 狀態分流 B：右翼側偏卡片 
            if (offset === 2) {
                $card.css({
                    "transform": "translate3d(100%, 0,0)  scale(0.5) rotateY(-55deg)",
                    "opacity": "0.3",
                    "z-index": "2"
                });
            }
            // 狀態分流 B：右翼側偏卡片 (側轉 -35 度)
            else if (offset === 1) {
                $card.css({
                    "transform": "translate3d(50%, 0,0)  scale(0.9) rotateY(-35deg)",
                    "opacity": "0.6",
                    "z-index": "3"
                });
            }
            // 狀態分流 A：當前主卡片位置 (居中浮空突圍)
            else if (offset === 0) {
                $card.addClass("active");
                $card.css({
                    "transform": "translate3d(0, 0, 100px) rotateY(0deg)",
                    "opacity": "1",
                    "z-index": "5"
                });
            }
            // 狀態分流 C：左翼側偏卡片 、側轉 35 度)
            else if (offset === -1) {
                $card.css({
                    "transform": "translate3d(-50%, 0,0)  scale(0.9) rotateY(35deg)",
                    "opacity": "0.6",
                    "z-index": "3"
                });
            }
            else if (offset === -2) {
                $card.css({
                    "transform": "translate3d(-100%, 0,0)  scale(0.5) rotateY(55deg)",
                    "opacity": "0.3",
                    "z-index": "2"
                });
            }
            // 保底過濾：其餘看不見的卡片完全隱形在時空最底層
            else {
                $card.css({
                    "transform": "translate3d(0, 0, -300px) rotateY(0deg)",
                    "opacity": "0",
                    "z-index": "1"
                });
            }
        });
    }
    // 初始化舞台矩陣位置
    card3d();
    // 🚀 控制台按鈕點擊：切換下一位職人 (內嵌 Animate.css 脈衝)
    $("#artisanNextBtn").on("click", function (e) {
        e.preventDefault();
        ac = (ac + 1) % cs;
        card3d();
    });
    // 切換上一位職人
    $("#artisanPrevBtn").on("click", function (e) {
        e.preventDefault();
        ac = (ac - 1 + cs) % cs;
        card3d();
    });
    // 視窗大小改變自適應
});
