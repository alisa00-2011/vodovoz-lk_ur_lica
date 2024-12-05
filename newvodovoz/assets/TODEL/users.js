$(document).ready(function () {
	var cabinet = {
		smsCountDownTimer: null,
		init_popup: function init_popup(param) {
			param.trigger_link.leafLetPopUp({
				closeBtnLocation: 'box',
				//selector: _this,
				content: param.content_callback,
				boxWidth: function() {
					return param.boxWidth || 600
				},
				beforeLoad: function(scroll, leaflet) {
					var $leaflet = $('.b-leaflet');

					$leaflet.data('triggerElement', param.trigger_link);

					if (param.leafletMod) {
						$('body').addClass(param.leafletMod);
						$leaflet.addClass(param.leafletMod);
					}
				},
				beforeClose: function(leaflet) {
					if (param.leafletMod) {
						$('body').removeClass(param.leafletMod);
					}
				},
				afterLoad: param.afterLoad_callback || function() {
					forms.init('.b-leaflet');
				}
			});
		},
		show_popup: function show_popup(param) {
			param.trigger_link.leafLetPopUp('show',{
				closeBtnLocation: 'box',
				content: param.content_callback,
				boxWidth: function() {
					return param.boxWidth || 600
				},
				beforeLoad: function(scroll, leaflet) {
					var $leaflet = $('.b-leaflet');

					$leaflet.data('triggerElement', param.trigger_link);

					if (param.leafletMod) {
						$('body').addClass(param.leafletMod);
						$leaflet.addClass(param.leafletMod);
					}
				},
				beforeClose: function(leaflet) {
					if (param.leafletMod) {
						$('body').removeClass(param.leafletMod);
					}
				},
				afterLoad: param.afterLoad_callback || function() {
					forms.init('.b-leaflet');
				}
			});
		},
		auth: function auth() {
			var $this = this;

			$('.user_popup').each(function(){
				var _this = $(this),
						popup_div = $('#' + _this.data('html_id')),
						//popup_div = $('#user_phone_test_erp'),
						popup_html = (popup_div.length > 0) ? popup_div.html() : '',
						param={
							'trigger_link' : _this,
							'boxWidth' : _this.data('boxWidth'),
							'leafletMod' : _this.data('leafletMod'),
							'content_callback' : function() {
								return popup_html;
							}
						};

				$this.init_popup(param);
			})
		},
		smsCountDown: function smsCountDown(callback, el) {
			var $this = this;

			el[0].innerHTML--;
			if (Number(el[0].innerHTML) === 0) {
				clearTimeout($this.smsCountDownTimer);
				if (!!callback)
					callback();
			} else {
				$this.smsCountDownTimer = setTimeout(function() {
					$this.smsCountDown(callback, el);
				}, 1000);
			}
		},
    test_erp: function test_erp() {
			var $this = this;

			$this.smsCountDownTimer = null;



			$(document).on('submit','.js_user_phone_test_erp form',function(event){
				event.preventDefault();

				var _this = $(this),
						formData = _this.find('input, select, textarea').serializeObject(),
						data = $.extend({}, formData),
            $phone = $('.js_user_phone_input', _this).val();

				//console.log(_this.data('url'));
				// TODO add disable submit button
				helpers.delay.call(_this, function() {
					$.ajax({
						url: '/udata/users/user_test_erp/.json',
						dataType: 'json',
						data: data,
						success: function(response) {
              if (!!response.code){
                var msg = (!!response.msg) ? response.msg : 'Неизвестная ошибка',
                  phone_format = (!!response.phone_format) ? response.phone_format : $phone;
                
                switch(response.code) {
                  /** 101 - "Телефон подтвержден. ERP ID существует"
                  * 102 - "Телефон подтвержден. ERP - контрагент найден и получены его актуальные данные"
                  * 190 - "Телефон подтвержден. ERP - неизвестная ошибка  при поиске контрагента"
                  * 199 - "Телефон подтвержден. ERP - неизвестная ошибка  при запросе"
                  * 110 - "Телефон подтвержден. ERP - контрагент не найден"
                  * 111 - "Телефон подтвержден. ERP - контрагент зарегистрирован без электронной почты (errorDescription = null)"
                  * 120 - "Телефон подтвержден. ERP - нужна ручная обработка"*/
  
  
                  /*
                  
                  case 20: // sms код неверный
                    $field_wrap.addClass('m-error');
    
                    break;
  
                  case 100: // Пользователь не найден, показываем окно ошибки
                    var _this = $(this),
                      popup_div = $('#user_unknown_error'),
                      param={
                        'trigger_link' : _this,
                        'boxWidth' : 384,
                        'leafletMod' :'b-leaflet__thin b-leaflet__user',
                        'content_callback' : function() {
                          if(popup_div.length > 0){
                            $('.popup_form_under' , popup_div).html(msg);
                            return popup_div.html();
                          }
                          return '';
                        }
                      };
    
                    $this.show_popup(param);
                    break;
  
                  default:
                  // code to be executed if n is different from case 1 and 2*/
                  
                  
                  case 101: // Телефон подтвержден. ERP ID существует
                  case 102: // Телефон подтвержден. ERP - контрагент найден и получены его актуальные данные
  
                    var popup_div = $('#user_auth_success'),
                      param={
                        'trigger_link' : $(this),
                        'boxWidth' : 384,
                        'leafletMod' : 'b-leaflet__thin b-leaflet__user',
                        'content_callback' : function() {
                          if(popup_div.length > 0){
                            $('.user_cabinet').removeClass('hidden');
                            $('.user_auth').addClass('hidden');
          
                            return popup_div.html();
                          }
                          return '';
                        }
                      };
  
                    $this.show_popup(param);
                    break;
 
                  case 190: // Телефон подтвержден. ERP - неизвестная ошибка  при поиске контрагента
                  case 199: // Телефон подтвержден. ERP - неизвестная ошибка  при запросе
                    var _this = $(this),
                      popup_div = $('#user_unknown_error'),
                      param={
                        'trigger_link' : _this,
                        'boxWidth' : 384,
                        'leafletMod' :'b-leaflet__thin b-leaflet__user',
                        'content_callback' : function() {
                          if(popup_div.length > 0){
                            //$('.popup_form_under' , popup_div).html(msg);
                            return popup_div.html();
                          }
                          return '';
                        }
                      };
  
                    $this.show_popup(param);
                    break;
  
                  case 110: // Телефон подтвержден. ERP - контрагент не найден
                    var popup_div = $('#user_registrate'),
                      param={
                        'trigger_link' : $(this),
                        'boxWidth' : 384,
                        'leafletMod' : 'b-leaflet__thin b-leaflet__user',
                        'content_callback' : function() {
                          if(popup_div.length > 0){
          
                            $('.js_user_registrate_phone' , popup_div).val($phone);
                            $('.js_user_registrate_phone_text' , popup_div).html(phone_format);
                            /*console.log($phone);
                            console.log( $('.js_user_registrate_phone' , popup_div));
                            console.log( $('.js_user_registrate_phone_text' , popup_div).val());
                            console.log( popup_div.html());*/
          
                            return popup_div.html();
                          }
                          return '';
                        }
                      };
  
                    $this.show_popup(param);
  
                    break;
                  case 111: // Телефон подтвержден. ERP - контрагент зарегистрирован без электронной почты
                    var popup_div = $('#user_registrate'),
                      param={
                        'trigger_link' : $(this),
                        'boxWidth' : 384,
                        'leafletMod' : 'b-leaflet__thin b-leaflet__user',
                        'content_callback' : function() {
                          if(popup_div.length > 0){
          
                            $('.js_user_registrate_phone' , popup_div).val($phone);
                            $('.js_user_registrate_phone_text' , popup_div).html(phone_format);
                            $('#edit_f_fname' , popup_div).html(response.first_name);
                            $('#edit_f_lname' , popup_div).html(response.surname);
                            $('#edit_f_father_name' , popup_div).html(response.patronymic);
                            /*console.log($phone);
                            console.log( $('.js_user_registrate_phone' , popup_div));
                            console.log( $('.js_user_registrate_phone_text' , popup_div).val());
                            console.log( popup_div.html());*/
          
                            return popup_div.html();
                          }
                          return '';
                        }
                      };
  
                    $this.show_popup(param);
                    break;
                    
                  case 120 : // Телефон подтвержден. ERP - нужна ручная обработка
                    console.log('120');
                    var _this = $(this),
                    popup_div = $('#user_erp_need_manual_handling'),
                    param={
                      'trigger_link' : _this,
                      'boxWidth' : 384,
                      'leafletMod' :'b-leaflet__thin b-leaflet__user',
                      'content_callback' : function() {
                        if(popup_div.length > 0){
                          //$('.popup_form_under' , popup_div).html(msg);
                          return popup_div.html();
                        }
                        return '';
                      }
                    };
  
                    console.log(popup_div);

                    $this.show_popup(param);
                    break;
                    
                  case 50:
                    // несколько пользователей с таким телефоном
                    var _this = $(this),
                      popup_div = $('#user_auth_several_users'),
                      param={
                        'trigger_link' : _this,
                        'boxWidth' : 384,
                        'leafletMod' :'b-leaflet__thin b-leaflet__user',
                        'content_callback' : function() {
                          if(popup_div.length > 0){
                            return popup_div.html();
                          }
                          return '';
                        }
                      };
  
                    $this.show_popup(param);
                    break;
                    
                  case 80:
                    // Слишком частая отправка sms
                    var _this = $(this),
                      popup_div = $('#user_auth_too_often_sms_send'),
                      param={
                        'trigger_link' : _this,
                        'boxWidth' : 384,
                        'leafletMod' :'b-leaflet__thin b-leaflet__user',
                        'content_callback' : function() {
                          if(popup_div.length > 0){
                            return popup_div.html();
                          }
                          return '';
                        }
                      };
    
                    $this.show_popup(param);
                    break;
                    
                  default:
                    // Ошибка sms
                    var _this = $(this),
                      popup_div = $('#user_auth_sms_send_error'),
                      param={
                        'trigger_link' : _this,
                        'boxWidth' : 384,
                        'leafletMod' :'b-leaflet__thin b-leaflet__user',
                        'content_callback' : function() {
                          if(popup_div.length > 0){
                            return popup_div.html();
                          }
                          return '';
                        }
                      };
  
                    $this.show_popup(param);
                    break;
                  // code to be executed if n is different from case 1 and 2
                }
              }else{
                //TODO неизвестная ошибка
              }

						},
						error: function() {
							self.handleError({
								message: 'Произошла ошибка'
							});
						}
					});
				});

			})
		},
    auth_phone_submit: function auth_phone_submit() {
			var $this = this;

			$this.smsCountDownTimer = null;



			$(document).on('submit','.js_user_phone form',function(event){
				event.preventDefault();

				var _this = $(this),
						formData = _this.find('input, select, textarea').serializeObject(),
						data = $.extend({}, formData);

				//console.log(_this.data('url'));
				// TODO add disable submit button
				helpers.delay.call(_this, function() {
					$.ajax({
						url: _this.data('url') || window.location,
						dataType: 'json',
						data: data,
						success: function(response) {
              if (!!response.code){
                switch(response.code) {
                  case 10: // пользователь найден, подтверждаем его по sms и открываем ЛК
                  case 60: // новый пользователь, подтверждаем его по sms и открываем всплывашку регистрации
                    var _this = $(this),
                      popup_div = $('#user_check_sms'),
                      param={
                        'trigger_link' : _this,
                        'boxWidth' : 384,
                        'leafletMod' :'b-leaflet__thin b-leaflet__user',
                        'content_callback' : function() {
                          if(popup_div.length > 0){
                            if(!!response.phone){
                              popup_div.find('.js_user_check_sms_phone').val(response.phone);
                            }
                            if(!!response.new_user){
                              popup_div.find('.js_user_check_sms_phone_new_user').val(response.new_user);
                            }
                            if(!!response.phone_text){
                              popup_div.find('.js-user_check_sms_for_phone').text(response.phone_text);
                            }
                            return popup_div.html();
                          }
                          return '';
                        },
                        'afterLoad_callback' : function() {
                          forms.init('.b-leaflet');
        
                          // обнулить таймер смс
                          var $form = $('.b-leaflet').find('.js_user_check_sms form'),
                            $repeat_sms_btn = $form.find('.js_user_repeat_sms_btn'),
                            $timer = $form.find('.js_user_check_sms-timer');
        
                          $repeat_sms_btn.removeClass('hidden');
                          $timer.addClass('hidden');
                          clearTimeout($this.smsCountDownTimer);
                        }
                      };
  
                    $this.show_popup(param);
                    break;
                  case 50:
                    // несколько пользователей с таким телефоном
                    var _this = $(this),
                      popup_div = $('#user_auth_several_users'),
                      param={
                        'trigger_link' : _this,
                        'boxWidth' : 384,
                        'leafletMod' :'b-leaflet__thin b-leaflet__user',
                        'content_callback' : function() {
                          if(popup_div.length > 0){
                            return popup_div.html();
                          }
                          return '';
                        }
                      };
  
                    $this.show_popup(param);
                    break;
                    
                  case 80:
                    // Слишком частая отправка sms
                    var _this = $(this),
                      popup_div = $('#user_auth_too_often_sms_send'),
                      param={
                        'trigger_link' : _this,
                        'boxWidth' : 384,
                        'leafletMod' :'b-leaflet__thin b-leaflet__user',
                        'content_callback' : function() {
                          if(popup_div.length > 0){
                            return popup_div.html();
                          }
                          return '';
                        }
                      };
    
                    $this.show_popup(param);
                    break;
                    
                  default:
                    // Ошибка sms
                    var _this = $(this),
                      popup_div = $('#user_auth_sms_send_error'),
                      param={
                        'trigger_link' : _this,
                        'boxWidth' : 384,
                        'leafletMod' :'b-leaflet__thin b-leaflet__user',
                        'content_callback' : function() {
                          if(popup_div.length > 0){
                            return popup_div.html();
                          }
                          return '';
                        }
                      };
  
                    $this.show_popup(param);
                    break;
                  // code to be executed if n is different from case 1 and 2
                }
              }else{
                //TODO неизвестная ошибка
              }

						},
						error: function() {
							self.handleError({
								message: 'Произошла ошибка'
							});
						}
					});
				});

			})
		},
		auth_change_phone: function auth_change_phone() {
			var $this = this;

			$(document).on('click','.js_user_change_phone',function(event){
				event.preventDefault();

				var popup_div = $('#' + $(this).data('html_id')),
						param={
							'trigger_link' : $(this),
							'boxWidth' : $(this).data('boxWidth'),
							'leafletMod' : $(this).data('leafletMod'),
							'content_callback' : function() {
								if(popup_div.length > 0){
									return popup_div.html();
								}
								return '';
							}
						};

				$this.show_popup(param);
			});
		},
		auth_repeat_sms: function auth_repeat_sms() {
			var $this = this;

			$(document).on('click','.js_user_repeat_sms_btn',function(event){
				event.preventDefault();

				var $form = $(this).closest('form'),
					$phone = $form.find('.js_user_check_sms_phone').val(),
					$url = $form.data('repeat-url');

				helpers.delay.call($(this), function() {
					$.ajax({
						url: $url || window.location,
						dataType: 'json',
						data: {phone:$phone},
						success: function(response) {
              // Слишком частая отправка sms
              if(!!response.code && response.code == 80){
                var _this = $(this),
                  popup_div = $('#user_auth_too_often_sms_send'),
                  param={
                    'trigger_link' : _this,
                    'boxWidth' : 384,
                    'leafletMod' :'b-leaflet__thin b-leaflet__user',
                    'content_callback' : function() {
                      if(popup_div.length > 0){
                        return popup_div.html();
                      }
                      return '';
                    }
                  };
  
                $this.show_popup(param);
              }else{
                // пользователь найден sms код отправлен
                if (!!response.code && response.code == 10) {
                  console.log('js_user_repeat_sms_btn - YES');
  
                  var $repeat_sms_btn = $form.find('.js_user_repeat_sms_btn'),
                    $timer = $form.find('.js_user_check_sms-timer');
  
                  /* timer */
                  var repeat_count = (!!$repeat_sms_btn.data('repeat_count') && $repeat_sms_btn.data('repeat_count') > 0) ? $repeat_sms_btn.data('repeat_count') + 1 : 1;
  
                  console.log('js_user_repeat_sms_btn - repeat_count = ' + repeat_count);
  
                  $repeat_sms_btn.data('repeat_count', repeat_count);
                  if(repeat_count < 3){
                    $repeat_sms_btn.addClass('hidden');
                    $timer
                      .removeClass('hidden')
                      .find('[data-timer]')
                      .html($form.data('repeatTimer') ? $form.data('repeatTimer') + 1 : 31);
  
                    console.log('js_user_repeat_sms_btn - data-timer = ' + $timer.find('[data-timer]'));
  
                    $this.smsCountDown(function() {
                      isSent = false;
                      $timer.addClass('hidden');
                      $repeat_sms_btn.removeClass('hidden');
                    }, $timer.find('[data-timer]'))
                  }else{
                    // TODO show recaptcha
                    //$btn.closest('form').find('.g-recaptcha').removeClass('hidden');
                  }
                }else {
                  // TODO неизвестная ошибка вывод всплывашки
                }
              }
						},
						error: function() {
							self.handleError({
								message: 'Произошла ошибка'
							});
						}
					});
				});
			});
		},
		auth_check_sms: function auth_check_sms() {
			var $this = this;

			$(document).on('keyup', '.js-user_check_sms_input', function(e) {
				var $field = $(this),
					$value = $field.val(),
					$field_wrap = $field.closest('.b-form_box'),
					$form = $field.closest('.js_user_check_sms form'),
					$phone = $('.js_user_check_sms_phone', $form).val(),
					$error_message = $form.find('.b-form_box_error'),
					isComplete = $value.replace(/\D/g, '').length === 4;

				helpers.delay.call($field, function() {
					if (isComplete) {
						var formData = $form.find('input, select, textarea').serializeObject(),
							data = $.extend({}, formData);

						$.ajax({
							url: $form.data('url') || window.location,
							dataType: 'json',
							data: data,
							success: function(response) {
                var msg = (!!response.msg) ? response.msg : 'Неизвестная ошибка',
                    phone_format = (!!response.phone_format) ? response.phone_format : $phone;
                
                switch(response.code) {
                  case 10: // sms код верный, доступ в ЛК
                    var popup_div = $('#user_auth_success'),
                      param={
                        'trigger_link' : $(this),
                        'boxWidth' : 384,
                        'leafletMod' : 'b-leaflet__thin b-leaflet__user',
                        'content_callback' : function() {
                          if(popup_div.length > 0){
                            $('.user_cabinet').removeClass('hidden');
                            $('.user_auth').addClass('hidden');
          
                            return popup_div.html();
                          }
                          return '';
                        }
                      };
  
                    $this.show_popup(param);
                    
                    break;
                  case 50: // sms код верный,новый пользователь, открываем всплывашку регистрации
                    var popup_div = $('#user_registrate'),
                      param={
                        'trigger_link' : $(this),
                        'boxWidth' : 384,
                        'leafletMod' : 'b-leaflet__thin b-leaflet__user',
                        'content_callback' : function() {
                          if(popup_div.length > 0){
                           
                            $('.js_user_registrate_phone' , popup_div).val($phone);
                            $('.js_user_registrate_phone_text' , popup_div).html(phone_format);
                            /*console.log($phone);
                            console.log( $('.js_user_registrate_phone' , popup_div));
                            console.log( $('.js_user_registrate_phone_text' , popup_div).val());
                            console.log( popup_div.html());*/
                            
                            return popup_div.html();
                          }
                          return '';
                        }
                      };
  
                    $this.show_popup(param);
  
                    break;
                  case 20: // sms код неверный
                    $field_wrap.addClass('m-error');
                    
                    break;
                    
                  case 100: // Пользователь не найден, показываем окно ошибки
                    var _this = $(this),
                      popup_div = $('#user_unknown_error'),
                      param={
                        'trigger_link' : _this,
                        'boxWidth' : 384,
                        'leafletMod' :'b-leaflet__thin b-leaflet__user',
                        'content_callback' : function() {
                          if(popup_div.length > 0){
                            $('.popup_form_under' , popup_div).html(msg);
                            return popup_div.html();
                          }
                          return '';
                        }
                      };
  
                    $this.show_popup(param);
                    break;
                  
                  default:
                  // code to be executed if n is different from case 1 and 2
                }
							  
							  //else if(!!response.code && response.code == 20){
									
									
								//}
							},
							error: function() {
								self.handleError({
									message: 'Произошла ошибка'
								});
							}
						});
					}else{
						$error_message.addClass('hidden');
					}
				});
			});
		},
    registrate: function registrate() {
			var $this = this;
  
      $(document).on('submit','.js_user_registrate form',function(event){
        event.preventDefault();
  
        var _this = $(this),
          formData = _this.find('input, select, textarea').serializeObject(),
          data = $.extend({}, formData);
  
        //console.log(_this.data('url'));
        // TODO add disable submit button
        helpers.delay.call(_this, function() {
          $.ajax({
            url: '/udata/users/registrate_by_phone_do/.json',
            dataType: 'json',
            data: data,
            success: function(response) {
              if (!!response.code){
                var msg = (!!response.msg) ? response.msg : 'Неизвестная ошибка';
                
                switch(response.code) {
                  /* 10 - "Пользователь успешно зарегистрирован."
                  *
                  * 30 - "Пользователь уже авторизован"
                  * 40 - "Неверный формат номера телефона"
                  * 50 - "Пользователь с таким телефоном уже есть на сайте"*/
                  case 10: // Пользователь успешно зарегистрирован
                    var popup_div = $('#user_reg_success'),
                      param={
                        'trigger_link' : $(this),
                        'boxWidth' : 384,
                        'leafletMod' : 'b-leaflet__thin b-leaflet__user',
                        'content_callback' : function() {
                          if(popup_div.length > 0){
                            $('.user_cabinet').removeClass('hidden');
                            $('.user_auth').addClass('hidden');
          
                            return popup_div.html();
                          }
                          return '';
                        }
                      };
  
                    $this.show_popup(param);
                    break;
                    
                  case 30: // Пользователь уже авторизован
                    var popup_div = $('#user_already_auth'),
                      param={
                        'trigger_link' : $(this),
                        'boxWidth' : 384,
                        'leafletMod' : 'b-leaflet__thin b-leaflet__user',
                        'content_callback' : function() {
                          if(popup_div.length > 0){
                            $('.user_cabinet').removeClass('hidden');
                            $('.user_auth').addClass('hidden');
          
                            return popup_div.html();
                          }
                          return '';
                        }
                      };
  
                    $this.show_popup(param);
                    break;
                  case 40: // "Неверный формат номера телефона"
                  case 50: // "Пользователь с таким телефоном уже есть на сайте"
                    var _this = $(this),
                      popup_div = $('#user_unknown_error'),
                      param={
                        'trigger_link' : _this,
                        'boxWidth' : 384,
                        'leafletMod' :'b-leaflet__thin b-leaflet__user',
                        'content_callback' : function() {
                          if(popup_div.length > 0){
                            $('.popup_form_under' , popup_div).html(msg);
                            return popup_div.html();
                          }
                          return '';
                        }
                      };
              
                    $this.show_popup(param);
                    break;
            
                  default:
                  // code to be executed if n is different from case 1 and 2
                }
              }else{
                //TODO неизвестная ошибка
              }
        
            },
            error: function() {
              self.handleError({
                message: 'Произошла ошибка'
              });
            }
          });
        });
  
      })
		},
    show_order_full_info: function show_order_full_info() {
      var $this = this;
      
      $('.js_show_order_full_info').each(function(){
        var _this = $(this),
          popup_div = $('#' + _this.data('html_id')),
          popup_html = (popup_div.length > 0) ? popup_div.html() : '',
          param={
            'trigger_link' : _this,
            'leafletMod' : _this.data('leafletMod'),
            'content_callback' : function() {
              return popup_html;
            }
          };
        
        $this.init_popup(param);
      })
    },
    repeat_order: function repeat_order() {
      var $this = this;
  
      $(document).on('click','.js_repeat_order',function(event){
        event.preventDefault();
    
        var $this = $(this),
            $this_text = $('span', $this),
            order_popup = $this.closest('.js_popup_order'),
            order_id = $this.data('order_id'),
            $preloader = $('.cart-preloader');
  
        $preloader.addClass('preloader');
        
        $.ajax({
          url: '/udata/emarket/repeatOrder/.json?o_id=' + order_id,
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
    lk_feedback: function lk_feedback() {
		  console.log('lk_feedback');
      var $this = this;
  
      $(document).on('submit','.lk_feedback_form form',function(event){
        event.preventDefault();
  
        console.log('lk_content_feedback form submit');
        
        var _this = $(this),
            formData = _this.find('input, select, textarea').serializeObject(),
            data = $.extend({}, formData),
            $preloader = $('.cart-preloader');
  
  
        $preloader.addClass('preloader');
        console.log(_this);
        
        helpers.delay.call(_this, function() {
          console.log(_this);
          
          $.ajax({
            url: _this.data('url') || window.location,
            dataType: 'json',
            data: data,
            success: function(response) {
              console.log(_this);
              if (!!response.msg && response.msg != '') {
  
                var _this = $('.lk_feedback_form form');
                console.log(_this);
                console.log('success feedback');
    
                _this.trigger("reset");
  
                var
                  popup_div = $('#' + _this.data('html_id')),
                  popup_html = (popup_div.length > 0) ? popup_div.html() : '',
                  param={
                    'trigger_link' : _this,
                    'boxWidth' : _this.data('boxWidth'),
                    'leafletMod' : _this.data('leafletMod'),
                    'content_callback' : function() {
                      return popup_html;
                    }
                  };
  
                $this.show_popup(param);
                
                console.log(param);
                
              }else{
                console.log('fail feedback');
                //TODO неизвестная ошибка
              }
              $preloader.removeClass('preloader');
            },
            error: function() {
              console.log('unknown fail feedback');
              $preloader.removeClass('preloader');
              self.handleError({
                message: 'Произошла ошибка'
              });
            }
          });
        });
        
      });
    },
    /*purchase_return: function purchase_return() {
      var $this = this;
      
      $('.purchase_return').each(function(){
        console.log('afterLoad_callback_prer');
        var _this = $(this),
          popup_div = $('#' + _this.data('html_id')),
          popup_html = (popup_div.length > 0) ? popup_div.html() : '',
          param={
            'trigger_link' : _this,
            'boxWidth' : _this.data('boxWidth'),
            'leafletMod' : _this.data('leafletMod'),
            'content_callback' : function() {
              
              return popup_html;
            },
            'afterLoad_callback' : function() {
              console.log('afterLoad_callback_event');
              if($('.b-leaflet .js-selectric_pre').length > 0){
                $('.b-leaflet .js-selectric_pre').removeClass('js-pure').addClass('js-selectric');
              }
              if($('.b-leaflet .js-datePicker_pre').length > 0){
                console.log('js-datePicker_pre');
                $('.b-leaflet .js-datePicker_pre').each(function(){
                  var minDatePicker = new Date(),
                    $datePicker = $(this);
                  
                  minDatePicker.setDate(minDatePicker.getDate() + 1);
                  console.log($datePicker);
                  $datePicker.datepicker({
                    maxDate: minDatePicker,
                    classes: 'purchase_return_datepicker',
                    
                    
                  });
                });
              }
  
              console.log('select');
                var x, i, j, l, ll, selElmnt, a, b, c;
                /!*look for any elements with the class "custom-select":*!/
                x = document.getElementsByClassName("custom-select");
                console.log(x);
                l = x.length;
                for (i = 0; i < l; i++) {
                  selElmnt = x[i].getElementsByTagName("select")[0];
                  ll = selElmnt.length;
                  /!*for each element, create a new DIV that will act as the selected item:*!/
                  a = document.createElement("DIV");
                  a.setAttribute("class", "select-selected");
                  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
                  x[i].appendChild(a);
                  /!*for each element, create a new DIV that will contain the option list:*!/
                  b = document.createElement("DIV");
                  b.setAttribute("class", "select-items select-hide");
                  for (j = 1; j < ll; j++) {
                    /!*for each option in the original select element,
                    create a new DIV that will act as an option item:*!/
                    c = document.createElement("DIV");
                    c.innerHTML = selElmnt.options[j].innerHTML;
                    c.addEventListener("click", function(e) {
                        /!*when an item is clicked, update the original select box,
                        and the selected item:*!/
                        var y, i, k, s, h, sl, yl;
                        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
                        sl = s.length;
                        h = this.parentNode.previousSibling;
                        for (i = 0; i < sl; i++) {
                          if (s.options[i].innerHTML == this.innerHTML) {
                            s.selectedIndex = i;
                            h.innerHTML = this.innerHTML;
                            y = this.parentNode.getElementsByClassName("same-as-selected");
                            yl = y.length;
                            for (k = 0; k < yl; k++) {
                              y[k].removeAttribute("class");
                            }
                            this.setAttribute("class", "same-as-selected");
                            break;
                          }
                        }
                        h.click();
  
                        $(this).closest('.custom-select').addClass('selected');
                    });
                    b.appendChild(c);
                  }
                  x[i].appendChild(b);
  
                  
                  
                  
                  
                  a.addEventListener("click", function(e) {
                    var _this = $(this);
                    
                    console.log('click select');
                    /!*console.log(this);
                    console.log($(this));
                    console.log($(this.nextSibling));*!/
                    
                    /!*when the select box is clicked, close any other select boxes,
                    and open/close the current select box:*!/
                    e.stopPropagation();
                    closeAllSelect(this);
                    
                    if(_this.hasClass("select-arrow-active")){
                      _this.removeClass("select-arrow-active");
                      $(this.nextSibling).addClass("select-hide");
                    }else{
                      
                      _this.addClass("select-arrow-active");
                      $(this.nextSibling).removeClass("select-hide");
                    }
                    /!*this.nextSibling.classList.toggle("select-hide");
                    this.classList.toggle("select-arrow-active");*!/
                  });
                }
                function closeAllSelect(elmnt) {
                  //console.log('jkkkk');
                  /!*a function that will close all select boxes in the document,
                  except the current select box:*!/
                  var x, y, i, xl, yl, arrNo = [];
                  x = document.getElementsByClassName("select-items");
                  y = document.getElementsByClassName("select-selected");
                  xl = x.length;
                  yl = y.length;
                  for (i = 0; i < yl; i++) {
                    if (elmnt == y[i]) {
                      arrNo.push(i)
                    } else {
                      y[i].classList.remove("select-arrow-active");
                    }
                  }
                  for (i = 0; i < xl; i++) {
                    if (arrNo.indexOf(i)) {
                      x[i].classList.add("select-hide");
                    }
                  }
                }
                /!*if the user clicks anywhere outside the select box,
                then close all select boxes:*!/
                //document.addEventListener("click", closeAllSelect);
                $(window).click(function(event) {
                  if (!($(event.target).hasClass("js-select"))) {
                    console.log('not select click');
                    console.log($(event.target));
                    console.log(($(event.target).hasClass("js-select")));
                    //console.log($(e).hasClass('lookingfor'));
                    closeAllSelect(this);
                  }
                });
              
              forms.init('.b-leaflet');
            }
          };
        console.log('afterLoad_callback_pre');
        $this.init_popup(param);
      })
    },*/
		init: function init() {
			var $this = this;

			$this.auth();
			$this.test_erp();
			$this.auth_phone_submit();
			$this.auth_change_phone();
			$this.auth_repeat_sms();
			$this.auth_check_sms();
			$this.registrate();
			$this.show_order_full_info();
			$this.repeat_order();
			
			$this.lk_feedback();
			//$this.purchase_return();

		}
	}

	cabinet.init();
});

