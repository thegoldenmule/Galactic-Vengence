function LoginWindowController(){
	var _that = this,
		_failureView,
		_loginView;
	
	$(document).ready(function() {
		_loginView = $("#loginView");
		$(_loginView).dialog({
				autoOpen:false,
				modal:true,
				draggable:false,
				resizable:false,
				title:"Join the battle!",
				buttons:{
					"Login":function() {
						$(this).dialog('close');
					}
				},
				open:function(event, ui) { 
					//hide close button.
					$(this).parent().children().children('.ui-dialog-titlebar-close').hide();
				},
				closeOnEscape:false
			});
		
		_failureView = $("#loginFailureView");
		$(_failureView).dialog({
				autoOpen:false,
				modal:true,
				draggable:false,
				resizable:false,
				title:Game.getRandomErrorTitle(),
				closeOnEscape:false,
				open:function(event, ui) { 
					//hide close button.
					$(this).parent().children().children('.ui-dialog-titlebar-close').hide();
				},
				buttons:{
					"Play":function() {
						$(this).dialog('close');
					}
				}
			});
	});
	
	_that.createConnectionFailureWindow = function(callback) {
		$(_failureView)
			.bind('dialogclose', function() {
				if (null != callback) callback();
			})
			.dialog('open');
	};
	
	_that.createLoginWindow = function(callback) {
		$(_loginView)
			.bind('dialogclose', function() {
				if (null != callback) callback($('#loginView_usernameField').val());
			})
			.dialog('open');
	};
	
	return _that;
}
