$(document).ready(function () {
  var ordersList = {
    ordersBtnsActionsWrap: $('.cabinet_order_evaluation_actions'),
    preloader: $('.cart-preloader'),
    isLoading: false,
    showResponseOrdersList(html, isError = false, isHideAfterDelay = false) {
      var $this = this;
      $this.ordersBtnsActionsWrap.find('.errorMsg, .successMsg').remove();
      if(isError === true){
        html = "<div class='errorMsg'>" + html + "</div>";
      }else{
        html = "<div class='successMsg'>" + html + "</div>";
      }
      $this.ordersBtnsActionsWrap.html($this.ordersBtnsActionsWrap.html() + html);
      
      if(isHideAfterDelay === true){
        setTimeout(function(){$('.errorMsg, .successMsg').fadeOut('slow')}, 3000);
      }
    },
    startLoading() {
      var $this = this;
      
      $this.isLoading = true;
      $this.preloader.addClass('is-shown');
    },
    finishLoading() {
      var $this = this;
      
      $this.isLoading = false;
      $this.preloader.removeClass('is-shown');
    },
    copyOrderId() {
      let $this = this;
      
      // копирование номера заказа на странице подробной информации
      $('.evaluation_order-id-copy-btn').on('click',function(){
        console.log('hhh');
        let $this = $(this);
        let $thisNoticeWrap = $("span", $this);
        let $wrap = $this.closest('.cabinet_order_evaluation_order-id');
        
        $("span", $this).hide();
        
        var copiedtext = $(".orderId", $wrap).text();
        console.log(copiedtext);
        if (window.navigator.clipboard) {
          window.navigator.clipboard.writeText(copiedtext)
            .then(() => {
              console.log("copy");
              $thisNoticeWrap.text("Скопировано").show();
              setTimeout(function(){$thisNoticeWrap.fadeOut('slow')}, 4000);
            })
            .catch((error) => {
              console.log("not copy");
              $thisNoticeWrap.text("Ошибка копирования").show();
              setTimeout(function(){$thisNoticeWrap.fadeOut('slow')}, 4000);
            });
        } else {
          console.log("no navig");
          
          console.log(copiedtext)
          var $temp = $("<input>");
          $("body").append($temp);
          $temp.val(copiedtext).select();
          document.execCommand("copy");
          $temp.remove();
          
          $thisNoticeWrap.text("Скопировано").show();
          setTimeout(function(){$thisNoticeWrap.fadeOut('slow')}, 4000);
        }
        
      });
    },
    repeatOrder() {
      let $this = this;
      
      console.log('repeat init');
      $(document).on('click','.repeat-order-btn',function(event){
        event.preventDefault();
        console.log('repeat');
        
        var $thisBtn = $(this),
          repeatOrderInfo = $thisBtn.data('repeat_order'),
          erpOrderId = $thisBtn.data('eid'),
          erpOnlineOrderId = $thisBtn.data('eoid'),
          siteOrderId = $thisBtn.data('sid'),
          $preloader = $('.repeat-order-img');
        
        $this.startLoading();
        
        $.ajax({
          url: '/udata/emarket/repeatOrderItems/.json' ,
          data: {'item' : repeatOrderInfo, 'eid' : erpOrderId, 'eoid' : erpOnlineOrderId, 'sid' : siteOrderId, },
          dataType: 'json',
          success: function(response) {
            $this.finishLoading();
            if (!!response.status && response.status == 'successful') {
              
              $this.showResponseOrdersList("Заказ в вашей корзине", false, true);
              
              console.log(response);
              console.log('check amount');
              console.log(response.amount.isInteger());
              shopModules._updateCartWidget({'amount' : parseInt(response.amount) } );
              
              return;
              
              /*if (!!response.items){
                $.each(response.items, function(i, item) {
                  
                  var old_item_id = !!(item.old_item_id) ? item.old_item_id : 0,
                    item_status = !!(item.status) ? item.status : 0;
                  
                  if(item_status == 'error'){
                    $('.cabinet_popup_order_item[data-cart-item-id = "' + old_item_id + '"]', order_popup).addClass('not_available').after( "<div class=\"cart-notice \"><div class=\"cart-notice__inner\">Товара нет в наличии</div></div>" );
                  }
                });
                
                $this.text('Перейти в корзину').attr('href','/emarket/cart/').removeClass('js_repeat_order');
                $this.after("<span>Товар у вас в корзине</span>");
              }*/
              
            }else{
              $this.showResponseOrdersList(response.error, true, true);
              return;
            }
          },
          error: function () {
            $this.finishLoading();
            $this.showResponseOrdersList("Ошибка сервиса", true, true );
          }
        });
        
      });
    },
    showFeedbackLinksList() {
      let $this = this;
      
      $(document).on('click','.сontact-us-btn',function(event){
        event.preventDefault();
        $('.cabinet_order_evaluation-feedBackHub').addClass('active').show();

      });
      $(document).on('click','.cabinet_order_evaluation-feedBackHub.active .bg',function(event){
        event.preventDefault();
        $('.cabinet_order_evaluation-feedBackHub').removeClass('active').hide();

      });
    },
    addRating() {
      let $this = this;
      
      $(document).on('click','.addRating .star',function(event){
        event.preventDefault();
        
        let ratingValue = parseInt($(this).data('rating_value'));
        $('.addRating .star').removeClass('selected');
        $(this).addClass('selected');
        
        console.log('addRating');
        
        $('.more-detailed_block_item').each(function(){
          let reasonItem = $(this);
          let reasonForRatingArr = $(this).data('for_rating');
          
          reasonItem.find('input').prop('checked', false);
          reasonItem.find('.checker, .checker > span').removeClass('checked');
          if($.inArray(ratingValue, reasonForRatingArr) !== -1){
            reasonItem.fadeIn('fast');
          }else{
            reasonItem.fadeOut('fast');
          }
          
        })
        
        $('.more-detailed_block').fadeIn('fast');
        $('.cabinet_order_evaluation')
          .removeClass('rating-1-star')
          .removeClass('rating-2-star')
          .removeClass('rating-3-star')
          .removeClass('rating-4-star')
          .removeClass('rating-5-star')
          .removeClass('rating-rate-order');
        $('.cabinet_order_evaluation').addClass('rating-' + ratingValue +'-star')

      });
    },
    sendRating() {
      let $this = this;
      
      $(document).on('click','.js_addRating',function(event){
        event.preventDefault();
        let thisButton = $(this);
        if(thisButton.hasClass('disabled')){
          return;
        }
        thisButton.addClass('disabled');
        
        let ratingValue = $('.addRating .star.selected').data('rating_value');
        let orderRatingReasonsIds = [];
        $('.more-detailed_block_item input:checked').each(function(){
          orderRatingReasonsIds.push($(this).val());
        })
        
        let erpOrderId = $(this).data('eid');
        let erpOnlineOrderId = $(this).data('eoid');
        let comment = $('#comment').val();
        
        if(ratingValue < 5 && comment == '' && !(orderRatingReasonsIds.length > 0)){
          let wrap = $(this).closest('.more-detailed_block');
          wrap.addClass('empty_value');
          setTimeout(function(){
            wrap.removeClass('empty_value');
          }, 2000);
          
          thisButton.removeClass('disabled');
          return false;
        }
        
        $.ajax({
          url: '/udata/emarket/SendOrderRatingToErpDo/.json' ,
          data: {'orderId' : erpOrderId, 'onlineOrderId' : erpOnlineOrderId, 'rating' : ratingValue, 'comment' : comment, 'orderRatingReasonsIds' : orderRatingReasonsIds},
          dataType: 'json',
          success: function(response) {
            $this.finishLoading();
            if (!!response.status && response.status == 'successful') {
              
              $this.showResponseOrdersList("Оценка добавлена", false, true);
              setTimeout(function(){
                window.location.reload(true);
              }, 2000);

              return;

            }else{
              console.log(response.error)
              $this.showResponseOrdersList("Ошибка отправки", true, true);
              thisButton.removeClass('disabled');
              return;
            }
          },
          error: function () {
            $this.finishLoading();
            thisButton.removeClass('disabled');
            //$this.showResponseOrdersList("Ошибка сервиса", true, true );
          }
        });
        
        return false;
        
      });
    },
    showRatingMoreDetail() {
      let $this = this;
      
      $(document).on('click','.more-detailed-btn',function(event){
        event.preventDefault();
        let btnText = 'Подробнее';
        if($('.more-detailed_block').is(':visible')){
          $('.more-detailed_block').fadeOut('fast');
          btnText = 'Подробнее';
        }else{
          $('.more-detailed_block').fadeIn('fast');
          btnText = 'Скрыть';
        }
        $(this).text(btnText);
        
        
      });
    },
    init() {
      let $this = this;

      $this.copyOrderId();
      $this.repeatOrder();
      $this.showFeedbackLinksList();
      $this.addRating();
      $this.sendRating();
      $this.showRatingMoreDetail();
    }
  }
  
  ordersList.init();

  
  
  
});