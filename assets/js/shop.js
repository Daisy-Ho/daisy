/*
           商城範例
       */
let products = [
    {
        'id': 1,
        'title': '哈利波特: 神秘的魔法石',
        'price': 250,
        'thumbnail': '_assets/images/harryPotter-1.webp'
    },
    {
        'id': 2,
        'title': '哈利波特: 消失的密室',
        'price': 280,
        'thumbnail': '_assets/images/harryPotter-2.webp'
    },
    {
        'id': 3,
        'title': '哈利波特: 阿茲卡班的逃犯',
        'price': 299,
        'thumbnail': '_assets/images/harryPotter-3.webp'
    }
];
let shop = {
    'allProducts': [],
    'addToCartButtons': [], // 由於此按鈕現在是被 js 加到 HTML 中的, 稍後在 getElements() 中再選擇

    'cartToggle': document.getElementById('cart-toggle'), // 選擇 #cart-toggle, 即展開/關閉購物車的 button
    'productsContainer': document.getElementById('products-container'), // 選擇 #products-container, 即裝有商品的 div
    'addedProductsContainer': document.getElementById('added-products-container'), // 選擇 #added-products-container, 即裝有購物車中商品的 div
    'cartAmount': document.getElementById('cart-amount'), // 選擇 #cart-amount, 即裝有購物車中商品數量的 span
    'cartSubtotal': document.getElementById('cart-subtotal'), // 選擇 #cart-subtotal, 即裝有購物車中商品總價的 span
    'checkoutButton': document.getElementById('checkout-button'),
    'cookieName': 'cartItems',
    'urls': {
        'getProducts': 'https://cart-handler.weihaowang.work/api/products',
        'submit': 'https://cart-handler.weihaowang.work/api/cartHandler'
    },
    'cart': {
        'items': [],// 加入購物車的商品的 id
        'subtotal': 0, // 加入購物車的商品的總價
        'amount': 0    // 加入購物車的商品的數量
    },
    'init': function (productsInCookie) {
        this.fetchProducts();
        this.renderElements();
        this.getElements();
        this.addListeners();
        if (productsInCookie) {
            for (let i = 0; i < productsInCookie.length; i++) {
                //console.log(productsInCookie[i]);
                this.updateCart(productsInCookie[i])
            }
        }
    },
    'renderElements': function () {
        /*
            1.
            對 this.allProducts 使用 for 迴圈
            將以下商品 HTML 的模板加入 this.productsContainer 中
            記得將「書名」, 「縮圖」, 「價格」, 「商品id」換成正確的值 
        */
        for (const [i, item] of this.allProducts.entries()) {
            console.log(this);
            this.productsContainer.innerHTML += `<div class="product" id="product-` + (i + 1) + `">
                    <div class="product-thumbnail-wrapper"><img class="product-thumbnail" src="` + item.thumbnail + `"></div>
                    <div class="product-name">` + item.title + `</div>
                    <div class="product-price-wrapper"><span class="product-price">`+ item.price + `</span> 元</div>
                    <button class="add-to-cart-button" productId = "`+ item.id + `">加入購物車</button>
                </div>`
        }
    },
    'getElements': function () {
        this.addToCartButtons = document.getElementsByClassName('add-to-cart-button');
    },
    'addListeners': function () {
        /*
            2
            如同前一個練習, 對 this.addToCartButtons 使用 for 迴圈 
            按下「加入購物車」按鈕時呼叫 this.updateCart()
        */
        /*for (let [i, item] of this.addToCartButtons.entries()) {
            console.log(item);
            item.addEventListener('click', function () {
                this.updateCart();
                document.getElementById('product')[i];
            }.bind(this));
        當按下 this.cartToggle 時, body 加上 "viewing-cart" 這個 class
        再次按下 this.cartToggle 時, body 移除 "viewing-cart" 這個 class
        }*/

        for (let i = 0; i < this.addToCartButtons.length; i++) {
            let prodId = this.addToCartButtons[i].getAttribute("productId");
            console.log(this.addToCartButtons[i]);
            this.addToCartButtons[i].addEventListener('click', function () {
                this.updateCart(prodId);
            }.bind(this));
        }

        this.cartToggle.addEventListener('click', function () {
            document.body.classList.toggle("viewing-cart");
        })

        if (this.checkoutButton) {
            this.checkoutButton.addEventListener('click', function () {
                this.submit();
            }.bind(this));
        }

    },
    'updateCart': function (p_id) {
        /* 
                4.1
                如果 p_id 等於 this.allProducts[i] 的 id
                更新 this.cart.items, this.cart.subtotal, this.cart.amount
            */
        /* 
            4.2
            呼叫 this.updateCartUI(), 並將商品名稱跟價格傳進去
        */
        for (let i = 0; i < this.allProducts.length; i++) {
            let prod = this.allProducts;
            let cartNew = this.cart;
            if (p_id == prod[i].id) {
                cartNew.items.push(prod[i]['id']);
                cartNew.subtotal += prod[i]['price'];
                cartNew.amount += 1;
                this.updateCartUI(prod[i]['title'], prod[i]['price']);
            }
        }
        setCookie(this.cookieName, JSON.stringify(this.cart.items));
    },
    'updateCartUI': function (p_name, p_price) {
        /*
        5.1
        將以下商品 HTML 的模板加入 this.addedProductsContainer 中
        記得將「商品名稱」, 「價格」換成傳入的參數 
    */
        /*
        `<div class="added-product">
            <span class="added-product-thumbnail">` + 商品照片 + `</span>
            <span class="added-product-title">` + 商品名稱 + `</span>
            <span class="added-product-price">` + 價格 + `</span>
        </div>`
        */
        /*
            5.2
            更新 this.cartAmount 跟 this.cartSubtotal 的 innerText
        */
        //let temp = null;
        this.addedProductsContainer.innerHTML +=
            `<div class="added-product">
                            <span class="added-product-title">` + p_name + `</span>
                            <span class="added-product-price">` + p_price + `</span>
                        </div>` ;

        this.cartAmount.innerText = this.cart.amount;
        this.cartSubtotal.innerText = this.cart.subtotal;

    },
    'fetchProducts': function () {
        let request = new XMLHttpRequest();
        request.addEventListener('readystatechange', function () {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    // request 成功, 開始處理 response
                    console.log("request 成功, 開始處理 response");
                    this.allProducts = JSON.parse(request.responseText);
                }
            }
        }.bind(this));
        request.open("GET", this.urls.getProducts, false);
        request.send();
    },
    'submit': function () {
        let request = new XMLHttpRequest();
        request.addEventListener('readystatechange', function () {
            if (request.readyState == 4) {
                if (request.status === 200) {
                    eraseCookie(this.cookieName);
                    console.log("request 成功, 開始處理 response");
                }
            }
        }.bind(this));


        let data = {
            "token": '3cd006f5e6d5c25a39ab26f19e49cfbe9cb68805612f798058d58c959ee0e935',
            "items": this.cart.items,
            "subtotal": this.cart.subtotal

        }
        data = JSON.stringify(data);
        request.open("POST", this.urls.submit, true);
        request.setRequestHeader('Content-type', 'application/json')
        request.send(data);
    },
}