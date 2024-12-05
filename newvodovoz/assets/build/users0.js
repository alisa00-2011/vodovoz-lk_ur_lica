$(function() {
	$('.user_popup').each(function(){
		var _this = $(this),
			boxWidth = $(this).data('boxWidth'),
			popup_id = _this.data('html_id');

		$(this).leafLetPopUp({
			closeBtnLocation: 'box',
			//selector: _this,
			content: function() {
				if($('#' + popup_id).length > 0){
					return $('#' + popup_id).html();
				}
				return '';

			},
			boxWidth: function() {
				return boxWidth || 600
			},
			beforeLoad: function(scroll, leaflet) {
				var $leaflet = $('.b-leaflet');

				$leaflet.data('triggerElement', _this);

				if (_this.data('leafletMod')) {
					$('body').addClass(_this.data('leafletMod'));
					$leaflet.addClass(_this.data('leafletMod'));
				}
			},
			beforeClose: function(leaflet) {
				if (_this.data('leafletMod')) {
					$('body').removeClass(_this.data('leafletMod'));
				}
			},
			afterLoad: function() {
				forms.init('.b-leaflet');
			}

		});


	})


	var smsCountDownTimer = null;

	function smsCountDown(callback, el) {
		el[0].innerHTML--;
		if (Number(el[0].innerHTML) === 0) {
			clearTimeout(smsCountDownTimer);
			if (!!callback)
				callback();
		} else {
			smsCountDownTimer = setTimeout(function() {
				smsCountDown(callback, el);
			}, 1000);
		}
	}

	$(document).on('click','.js_user_change_phone',function(event){
		event.preventDefault();

		var _this = $(this),
			boxWidth = $(this).data('boxWidth'),
			leafletMod = _this.data('leafletMod'),
			popup_id = _this.data('html_id');

		$(this).leafLetPopUp('show',{
			closeBtnLocation: 'box',
			content: function() {
				if($('#' + popup_id).length > 0){

					return $('#' + popup_id).html();
				}
				return '';

			},
			boxWidth: function() {
				return boxWidth || 600
			},
			beforeLoad: function(scroll, leaflet) {
				var $leaflet = $('.b-leaflet');

				$leaflet.data('triggerElement', _this);

				if (leafletMod) {
					$('body').addClass(leafletMod);
					$leaflet.addClass(leafletMod);
				}
			},
			beforeClose: function(leaflet) {
				if (leafletMod) {
					$('body').removeClass(leafletMod);
				}
			},
			afterLoad: function() {
				forms.init('.b-leaflet');
			}


		});
	});


	$(document).on('submit','.js_user_phone form',function(event){
		event.preventDefault();

		var _this = $(this),
			formData = _this.find('input, select, textarea').serializeObject(),
			data = $.extend({}, formData);

		console.log(_this.data('url'));
		helpers.delay.call(_this, function() {
			$.ajax({
				url: _this.data('url') || window.location,
				dataType: 'json',
				data: data,
				success: function(response) {
					// пользователь найден sms код отправлен
					if (!!response.code && response.code == 10) {
						//console.log('aaa');
						var _this = $(this),
							boxWidth = 384,
							leafletMod = 'b-leaflet__thin b-leaflet__user',
							popup_id = 'user_check_sms';

						$(this).leafLetPopUp('show',{
							closeBtnLocation: 'box',
							content: function() {
								if($('#' + popup_id).length > 0){

									if(!!response.phone){
										$('#' + popup_id).find('.js_user_check_sms_phone').val(response.phone);
									}
									if(!!response.phone_text){
										$('#' + popup_id).find('.js-user_check_sms_for_phone').text(response.phone_text);
									}
									return $('#' + popup_id).html();
								}
								return '';

							},
							boxWidth: function() {
								return boxWidth || 600
							},
							beforeLoad: function(scroll, leaflet) {
								var $leaflet = $('.b-leaflet');

								$leaflet.data('triggerElement', _this);

								if (leafletMod) {
									$('body').addClass(leafletMod);
									$leaflet.addClass(leafletMod);
								}
							},
							beforeClose: function(leaflet) {
								if (leafletMod) {
									$('body').removeClass(leafletMod);
								}
							},
							afterLoad: function() {
								forms.init('.b-leaflet');

								// обнулить таймер смс
								var $form = $('.b-leaflet').find('.js_user_check_sms form'),
									$repeat_sms_btn = $form.find('.js_user_repeat_sms_btn'),
									$timer = $form.find('.js_user_check_sms-timer');

								$repeat_sms_btn.removeClass('hidden');
								$timer.addClass('hidden');
								clearTimeout(smsCountDownTimer);
							}


						});
					}else if (!!response.code && response.code == 50) {
						// несколько пользователей с таким телефоном
						var _this = $(this),
							boxWidth = 384,
							leafletMod = 'b-leaflet__thin b-leaflet__user',
							popup_id = 'user_auth_several_users';

						$(this).leafLetPopUp('show',{
							closeBtnLocation: 'box',
							content: function() {
								if($('#' + popup_id).length > 0){

									return $('#' + popup_id).html();
								}
								return '';

							},
							boxWidth: function() {
								return boxWidth || 600
							},
							beforeLoad: function(scroll, leaflet) {
								var $leaflet = $('.b-leaflet');

								$leaflet.data('triggerElement', _this);

								if (leafletMod) {
									$('body').addClass(leafletMod);
									$leaflet.addClass(leafletMod);
								}
							},
							beforeClose: function(leaflet) {
								if (leafletMod) {
									$('body').removeClass(leafletMod);
								}
							},
							afterLoad: function() {
								forms.init('.b-leaflet');
							}


						});
					}else {
						window.location.href = "/users/registrate/";
					}
					// else if (!response.status) {
					// self.handleError(response);
					// }
				},
				error: function() {
					self.handleError({
						message: 'Произошла ошибка'
					});
				}
			});
		});

	})

	$(document).on('click','.js_user_repeat_sms_btn',function(event){
		event.preventDefault();

		console.log('js_user_repeat_sms_btn');

		var $form = $(this).closest('form'),
			$phone = $form.find('.js_user_check_sms_phone').val(),
			$url = $form.data('repeat-url');

		console.log('js_user_repeat_sms_btn $url=' + $url);
		console.log($.extend({}, {'phone':$phone}));
		console.log({phone:$phone});

		$.ajax({
			url: $url || window.location,
			dataType: 'json',
			data: {phone:$phone},
			success: function(response) {
				console.log('js_user_repeat_sms_btn - SEND');
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

						smsCountDown(function() {
							isSent = false;
							$timer.addClass('hidden');
							$repeat_sms_btn.removeClass('hidden');
						}, $timer.find('[data-timer]'))
					}else{
						//show recaptcha
						//$btn.closest('form').find('.g-recaptcha').removeClass('hidden');
					}
				}else {
					// TODO неизвестная ошибка вывод всплывашки
				}
			},
			error: function() {
				self.handleError({
					message: 'Произошла ошибка'
				});
			}
		});
	});


	$(document).on('keyup', '.js-user_check_sms_input', function(e) {
		var $field = $(this),
			$value = $field.val(),
			$field_wrap = $field.closest('.b-form_box'),
			$form = $field.closest('.js_user_check_sms form'),
			$error_message = $form.find('.b-form_box_error'),
			isComplete = $value.replace(/\D/g, '').length === 4;

		console.log(isComplete);

		helpers.delay.call($field, function() {
			if (isComplete) {
				var formData = $form.find('input, select, textarea').serializeObject(),
					data = $.extend({}, formData);

				$.ajax({
					url: $form.data('url') || window.location,
					dataType: 'json',
					data: data,
					success: function(response) {
						// sms код верный
						if (!!response.code && response.code == 10) {
							//console.log('aaa');
							var _this = $(this),
								boxWidth = 384,
								leafletMod = 'b-leaflet__thin b-leaflet__user',
								popup_id = 'user_auth_success';

							$(this).leafLetPopUp('show',{
								closeBtnLocation: 'box',
								content: function() {
									console.log($('#' + popup_id));
									if($('#' + popup_id).length > 0){

										$('.user_cabinet').removeClass('hidden');
										$('.user_auth').addClass('hidden');
										return $('#' + popup_id).html();
									}
									return '';

								},
								boxWidth: function() {
									return boxWidth || 600
								},
								beforeLoad: function(scroll, leaflet) {
									var $leaflet = $('.b-leaflet');

									$leaflet.data('triggerElement', _this);

									if (leafletMod) {
										$('body').addClass(leafletMod);
										$leaflet.addClass(leafletMod);
									}
								},
								beforeClose: function(leaflet) {
									if (leafletMod) {
										$('body').removeClass(leafletMod);
									}
								},
								afterLoad: function() {
									forms.init('.b-leaflet');
								}


							});
						}else if(!!response.code && response.code == 20){
							// sms код неверный
							console.log('sms 20');
							console.log($field_wrap);
							$field_wrap.addClass('m-error');

						}
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






});
