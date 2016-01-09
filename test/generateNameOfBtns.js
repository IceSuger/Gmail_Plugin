$('[data-i18n-content]').each(function() {
	//alert('i18n-content-该被赋值了');
	var message = chrome.i18n.getMessage(this.getAttribute('data-i18n-content'));
	if (message) {
		$(this).html(message);
	}
});
$('[data-i18n-value]').each(function() {
	//alert('i18n-value-该被赋值了');
	var message = chrome.i18n.getMessage(this.getAttribute('data-i18n-value'));
	$(this).val(message);
});