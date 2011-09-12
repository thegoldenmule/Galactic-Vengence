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
				}
			});
		
		_failureView = $("#loginFailureView");
		$(_failureView).dialog({
				autoOpen:false,
				modal:true,
				draggable:false,
				resizable:false,
				title:Game.getRandomErrorTitle()
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
