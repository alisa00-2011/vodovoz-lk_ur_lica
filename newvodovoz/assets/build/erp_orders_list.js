$(document).ready(function () {
  var ordersList = {
    ordersListWrap: $('.cabinet_orders_list:first'),
    preloader: $('.cart-preloader'),
    isLoading: false,
    isNoOrderToShow: false, // все заказы отображены ?
    perPage: 50,
    currPage: 1,
    showResponseOrdersList(html, isError = false, isHideAfterDelay = false) {
      var $this = this;
      $this.ordersListWrap.find('.errorMsg, .successMsg').remove();
      if(isError === true){
        html = "<div class='errorMsg'>" + html + "</div>";
      }/*else{
        html = "<div class='successMsg'>" + html + "</div>";
      }*/
      $this.ordersListWrap.html($this.ordersListWrap.html() + html);
      
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
    getOrdersList() {
      var $this = this;
      
      if($this.isNoOrderToShow === true){
        return;
      }
      
      $this.startLoading();
      
      $.ajax({
        url: '/udata/emarket/getUserErpOrdersList/' + $this.perPage + '/' + $this.currPage + '.json',
        dataType: 'json',
        success: function (response) {
          $this.finishLoading();
          if (!!response.error) {
            $this.showResponseOrdersList(response.error, true);
            return;
          }
          if (response.hasOwnProperty('orderInfo') && response.orderInfo.hasOwnProperty('ordersCount')) {
            if (!!response.orders && !!response.orders.order) {
              const orderItemTemplate = ({
                                           orderStatusClass,
                                           orderStatusTitle,
                                           ratingStatusClass,
                                           orderNumber,
                                           siteOrderId,
                                           orderId,
                                           onlineOrderId,
                                           orderSum,
                                           orderPaymentStatusClass,
                                           orderPaymentStatus,
                                           isNeedPayment,
                                           deliveryInfo
                                         }) => `
              <div class="cabinet_order_item ${orderStatusClass} status-order-being-formed ${orderPaymentStatusClass} ${ratingStatusClass} delivery-delivery">
                <div class="cabinet_order_item_header">
                  <div class="cabinet_order_item_title">
                    <div class="orderStatus">${orderStatusTitle}</div>
                    <div class="ratingValue">
                      <a href="/lk/lk_order/?sid=${siteOrderId}&eid=${orderId}&eoid=${onlineOrderId}" class="isRatingAvailable">оцените заказ</a>
                      <div class="stars">
                        <div class="star star-1"></div>
                        <div class="star star-2"></div>
                        <div class="star star-3"></div>
                        <div class="star star-4"></div>
                        <div class="star star-5"></div>
                      </div>
                    </div>
                  </div>
                  <a href="/lk/lk_order/?sid=${siteOrderId}&eid=${orderId}&eoid=${onlineOrderId}" class="cabinet_order_item_price">
                    Заказ № <span class="orderId">${orderNumber}</span> на сумму <span class="orderSum">${orderSum}</span> ₽
                  </a>
                  <div class="cabinet_order_item_status">
                    <div class="orderPaymentStatus">${orderPaymentStatus}</div>
                  </div>
                </div>
                ${isNeedPayment}
                ${deliveryInfo}
              </div>
            `;
              
              
              let orderItemHtml = '';
              $.each(response.orders.order, function (i, item) {
                orderItemHtml += [{
                  orderStatusTitle: $this.getOrdersStatusTitle(item),
                  orderStatusClass: $this.getOrdersStatusClass(item),
                  ratingStatusClass: $this.getOrdersRatingClass(item),
                  orderNumber: $this.getOrderNumber(item),
                  siteOrderId: $this.getSiteOrderId(item),
                  orderId: $this.getOrderId(item),
                  onlineOrderId: $this.getOnlineOrderId(item),
                  orderSum: $this.getOrderSum(item),
                  orderPaymentStatusClass: $this.getOrderPaymentStatusClass(item),
                  orderPaymentStatus: $this.getOrderPaymentStatusTitle(item),
                  isNeedPayment: $this.getIsNeedPaymentHtml(item),
                  deliveryInfo: $this.getDeliveryInfoHtml(item),
                }].map(orderItemTemplate).join('');
              });
              
              $this.showResponseOrdersList(orderItemHtml);
              $this.currPage = $this.currPage + 1;
            }else{
              // все заказы уже отображены
              $this.isNoOrderToShow = true;
            }
          }else {
            $this.showResponseOrdersList("Неизвестная ошибка", true);
          }
        },
        error: function () {
          $this.finishLoading();
          $this.showResponseOrdersList("Ошибка сервиса", true );
        }
      });
    },
    getOrdersRatingClass(item) {
      let ratingStatusClass = 'rating-no-rating';

      if (item.hasOwnProperty('ratingStatusClass')) {
        ratingStatusClass = item.ratingStatusClass;
      }
      
      return ratingStatusClass
    },
    getOrdersStatus(item) {
      return (!!item.orderStatus) ? item.orderStatus : '';
    },
    getOrdersStatusTitle(item) {
      return (!!item.orderStatusTitle) ? item.orderStatusTitle : '';

      /*let $this = this;
      let orderStatus = $this.getOrdersStatus(item);
      let orderStatusText = '';
      switch (orderStatus){
        case 'OrderProcessing':
          orderStatusText = "Заказ оформляется";
          break;
          
        case 'OrderPerformed':
          orderStatusText = "Заказ оформлен";
          break;
          
        case 'WaitingForPayment':
          orderStatusText = "Ожидание оплаты";
          break;
          
        case 'OrderCollecting':
          orderStatusText = "Заказ собирается";
          break;
          
        case 'OrderDelivering':
          orderStatusText = "Заказ доставляется";
          break;
          
        case 'OrderCompleted':
          orderStatusText = "Заказ выполнен";
          break;
          
        case 'Canceled':
          orderStatusText = "Отменен";
          break;
      }
        
      return orderStatusText;*/
    },
    getOrdersStatusClass(item) {
      return (!!item.orderStatusClass) ? item.orderStatusClass : '';
      /*let $this = this;
      let orderStatus = $this.getOrdersStatus(item);
      let orderStatusClass = '';
      switch (orderStatus){
        case 'OrderProcessing':
          orderStatusClass = "status-order-being-formed";
          break;
        
        case 'OrderPerformed':
          orderStatusClass = "status-order-formed";
          break;
        
        case 'WaitingForPayment':
          orderStatusClass = "status-order-awaiting-payment";
          break;
        
        case 'OrderCollecting':
          orderStatusClass = "status-order-collecting";
          break;
        
        case 'OrderDelivering':
          orderStatusClass = "status-order-delivering";
          break;
        
        case 'OrderCompleted':
          orderStatusClass = "status-order-received";
          break;
        
        case 'Canceled':
          orderStatusClass = "status-order-canceled";
          break;
      }
      
      return orderStatusClass;*/
    },
    getOrderNumber(item) {
      return (!!item.orderNumber) ? item.orderNumber : '';
      /*let orderId = "";

      if(item.hasOwnProperty('onlineOrderId') && item.onlineOrderId > 0){
        orderId = item.onlineOrderId;
      }else if(item.hasOwnProperty('orderId') && item.orderId > 0) {
        orderId = item.orderId;
      }

      return orderId;*/
    },
    getSiteOrderId(item) {
      return (item.hasOwnProperty('siteOrderId') && item.siteOrderId > 0) ? item.siteOrderId : "";
    },
    getOrderId(item) {
      return (item.hasOwnProperty('orderId') && item.orderId > 0) ? item.orderId : "";
    },
    getOnlineOrderId(item) {
      return (item.hasOwnProperty('onlineOrderId') && item.onlineOrderId > 0) ? item.onlineOrderId : "";
    },
    getOrderSum(item) {
      return (!!item.orderSum) ? item.orderSum : 0;
    },
    getOrderPaymentStatusClass(item) {
      return (!!item.orderPaymentStatusClass) ? item.orderPaymentStatusClass : '';
      /*let orderPaymentStatusClass = 'payment-no-status';
      if (item.hasOwnProperty('orderPaymentStatus') && item.orderPaymentStatus != null){
        let orderPaymentStatus = item.orderPaymentStatus.toLowerCase();
      
        //let orderPaymentStatus = "unpaid";
        switch (orderPaymentStatus){
          case 'paid':
            orderPaymentStatusClass = 'payment-paid';
            break;
          
          case 'unpaid':
            orderPaymentStatusClass = 'payment-not-paid'
            break;
        }
      }
      return orderPaymentStatusClass;*/
    },
    getOrderPaymentStatusTitle(item) {
      return (!!item.orderPaymentStatusTitle) ? item.orderPaymentStatusTitle : '';
      /*let orderPaymentStatusText = '';
      if (item.hasOwnProperty('orderPaymentStatus') && item.orderPaymentStatus != null){
        let orderPaymentStatus = item.orderPaymentStatus.toLowerCase();
        
        //let orderPaymentStatus = "unpaid";
        switch (orderPaymentStatus){
          case 'paid':
            orderPaymentStatusText = 'Оплачен';
            break;
          
          case 'unpaid':
            orderPaymentStatusText = 'Не оплачен'
            break;
        }
      }
      return orderPaymentStatusText;*/
    },
    getIsNeedPaymentHtml(item) {
      let isNeedPaymentHtml = '';
      if (item.hasOwnProperty('isNeedPayment') && item.isNeedPayment == 1){
        isNeedPaymentHtml = `
          <div  class="cabinet_order_item_warning">
            <div class="images">
              <svg width="28.000000" height="24.500000" viewBox="0 0 28 24.5" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <defs/>
                <path id="Vector" d="M0 22.75C0 23.71 0.62 24.5 1.39 24.5L26.6 24.5C27.37 24.5 28 23.71 28 22.75L28 5.25L0 5.25L0 22.75ZM19.6 11.37C19.6 10.89 19.91 10.5 20.29 10.5L24.5 10.5C24.88 10.5 25.2 10.89 25.2 11.37L25.2 13.12C25.2 13.6 24.88 14 24.5 14L20.29 14C19.91 14 19.6 13.6 19.6 13.12L19.6 11.37ZM19.6 17.93C19.6 17.69 19.75 17.5 19.95 17.5L24.85 17.5C25.04 17.5 25.2 17.69 25.2 17.93L25.2 18.81C25.2 19.05 25.04 19.25 24.85 19.25L19.95 19.25C19.75 19.25 19.6 19.05 19.6 18.81L19.6 17.93ZM2.79 12.68C2.79 12.44 2.95 12.25 3.14 12.25L16.45 12.25C16.64 12.25 16.79 12.44 16.79 12.68L16.79 13.56C16.79 13.8 16.64 14 16.45 14L3.14 14C2.95 14 2.79 13.8 2.79 13.56L2.79 12.68ZM2.79 17.93C2.79 17.69 2.95 17.5 3.14 17.5L10.85 17.5C11.04 17.5 11.2 17.69 11.2 17.93L11.2 18.81C11.2 19.05 11.04 19.25 10.85 19.25L3.14 19.25C2.95 19.25 2.79 19.05 2.79 18.81L2.79 17.93ZM27.29 0L0.7 0C0.31 0 0 0.39 0 0.87L0 3.5L28 3.5L28 0.87C28 0.39 27.68 0 27.29 0Z" fill="#000000" fill-opacity="1.000000" fill-rule="nonzero"/>
              </svg>
            </div>
            <div class="isNeedPayment">
              Заказ не будет доставлен!<br/>
              Оплатите заказ или выберите другой способ оплаты.
            </div>
          </div>
        `;
      }
      return isNeedPaymentHtml;
    },
    getDeliveryInfoHtml(item) {
      let $this = this;
      let deliveryInfoHtml = '';
      
      const deliveryInfoTemplate = ({deliveryInfoDate, deliveryInfoSchedule, deliveryInfoAddress}) => `
        <div class="cabinet_order_item_body">
          <div class="cabinet_order_item_info">
            <div class="isSelfDelivery">Доставка:</div>
            ${deliveryInfoDate}
            ${deliveryInfoSchedule}
            ${deliveryInfoAddress}
          </div>
        </div>
      `;
      
      deliveryInfoHtml = [{
        deliveryInfoDate: $this.getDeliveryInfoDate(item),
        deliveryInfoSchedule: $this.getDeliveryInfoSchedule(item),
        deliveryInfoAddress: $this.getDeliveryInfoAddress(item)
      }].map(deliveryInfoTemplate).join('');
      return deliveryInfoHtml;
    },
    getDeliveryInfoDate(item) {
      let deliveryInfoHtml = '';
      
      if (item.hasOwnProperty('deliveryDate') && item.deliveryDate != null) {
        
        const deliveryInfoDateTemplate = ({deliveryDate}) => `
          <div class="cabinet_order_item_info_date">
            Дата: <span class="deliveryDate">${deliveryDate}</span>
          </div>
        `;
        
        /*var pattern = "/(\d{4})\-(\d{2})\-(\d{2})/";
        var dt = new Date(item.deliveryDate.replace(pattern,'$1-$2-$3'));*/
        
        deliveryInfoHtml = [{
          deliveryDate: item.deliveryDate
          //deliveryDate: ('0' + dt.getDate()).slice(-2)  + "." + ('0' + (dt.getMonth()+1)).slice(-2) + "." + dt.getFullYear()
        }].map(deliveryInfoDateTemplate).join('');
      }
      return deliveryInfoHtml;
    },
    getDeliveryInfoSchedule(item) {
      let deliveryInfoSchedule = '';
    
      if (item.hasOwnProperty('deliverySchedule') && item.deliverySchedule != null) {
        const deliveryInfoScheduleTemplate = ({deliverySchedule}) => `
          <div class="cabinet_order_item_info_schedule">
            Время доставки: <span class="deliverySchedule">${deliverySchedule}</span>
          </div>
        `;
        
        deliveryInfoSchedule = [{
          deliverySchedule: item.deliverySchedule
        }].map(deliveryInfoScheduleTemplate).join('');
      }
      return deliveryInfoSchedule;
    },
    
    getDeliveryInfoAddress(item) {
      let deliveryInfoAddress = '';
    
      if (item.hasOwnProperty('deliveryAddress') && item.deliveryAddress != null) {
        const deliveryInfoAddressTemplate = ({deliveryAddress}) => `
          <div class="cabinet_order_item_info_adress">
            Адрес: <span class="deliveryAddress">${deliveryAddress}</span>
          </div>
        `;
        
        deliveryInfoAddress = [{
          deliveryAddress: item.deliveryAddress
        }].map(deliveryInfoAddressTemplate).join('');
      }
      return deliveryInfoAddress;
    },
    autoloadNextPage() {
      let $this = this;
      $(window).scroll(function() {
        if($(window).scrollTop() + $(window).height() > $this.ordersListWrap.height() && $this.isLoading === false) {
          console.log('auto load start');
          $this.getOrdersList();
        }
        /*console.log('$(window).scrollTop(): ' + $(window).scrollTop());
        console.log('$(\'.cabinet_orders_list_pagination\')[0].scrollTop(): ' + $('.cabinet_orders_list_pagination')[0].scrollTop());
        if($(window).scrollTop() == $('.cabinet_orders_list_pagination')[0].scrollTop()) {
          console.log('auto load start');
          // ajax call get data from server and append to the div
        }*/
      });
    },
    repeatOrder() {
      let $this = this;
      
      console.log('repeat init');
      $(document).on('click','.repeat-order-btn',function(event){
        event.preventDefault();
        console.log('repeat');
        
        var $this = $(this),
          repeatOrderInfo = $this.data('repeat_order'),
          erpOrderId = $this.data('eid'),
          erpOnlineOrderId = $this.data('eoid'),
          siteOrderId = $this.data('sid'),
          $preloader = $('.repeat-order-img');
        
        $preloader.addClass('preloader');
        
        $.ajax({
          url: '/udata/emarket/repeatOrderItems/.json?o_id=' + order_id,
          data: {'item' : repeatOrderInfo, 'eid' : erpOrderId, 'eoid' : erpOnlineOrderId, 'sid' : siteOrderId, },
          dataType: 'json',
          success: function(response) {
            if (!!response.status && response.status == 'successful') {
              
              $('.cart-notice', order_popup).remove();
              
              if (!!response.items){
                $.each(response.items, function(i, item) {
                  
                  var old_item_id = !!(item.old_item_id) ? item.old_item_id : 0,
                    item_status = !!(item.status) ? item.status : 0;
                  
                  if(item_status == 'error'){
                    $('.cabinet_popup_order_item[data-cart-item-id = "' + old_item_id + '"]', order_popup).addClass('not_available').after( "<div class=\"cart-notice \"><div class=\"cart-notice__inner\">Товара нет в наличии</div></div>" );
                  }
                });
                
                $this.text('Перейти в корзину').attr('href','/emarket/cart/').removeClass('js_repeat_order');
                $this.after("<span>Товар у вас в корзине</span>");
              }
              
            }else{
              //TODO неизвестная ошибка
            }
            $preloader.removeClass('preloader');
          },
          error: function() {
            $preloader.removeClass('preloader');
            self.handleError({
              message: 'Произошла ошибка'
            });
          }
        });
        
      });
    },
    init() {
      let $this = this;
      
      $this.getOrdersList();
      $this.autoloadNextPage();
      $this.repeatOrder();
    }
  }
  
  ordersList.init();
  
});