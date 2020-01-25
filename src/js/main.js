$(function(){
    //checkboxlar değiştiğinde total sayıyı değiştirelim
    $('input[type="checkbox"]').change(function() {
        let productGroupDom = $(this).parents('.modal__dgroup'),
            inputCheckedLength = productGroupDom.find('input[type="checkbox"]:checked').length,
            totalCountDom = productGroupDom.find('.js-select-count');

        totalCountDom.html(inputCheckedLength);
    });

    
    function setInputFilter(textbox, inputFilter) {
        ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
            //console.log(textbox);
            textbox.forEach((a) => {
                //console.log(a);
                a.addEventListener(event, function() {
                    if (inputFilter(this.value)) {
                        this.oldValue = this.value;
                        this.oldSelectionStart = this.selectionStart;
                        this.oldSelectionEnd = this.selectionEnd;
                    } else if (this.hasOwnProperty("oldValue")) {
                        this.value = this.oldValue;
                        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
                    }
                });
            });
            
        });
    }

    //counter input sadece rakam girilmesi için regex yazalım
    setInputFilter(document.querySelectorAll(".countinput__input"), (value) => { return /^[0-9]*$/.test(value); });
    
    //artıya tıklandığında
    $(document).on('click', '.js-count-plus', function(){
        let inputDom = $(this).parent().find('input'),
            inputValue = inputDom.val();

        if((inputValue * 1) >= 999) {
            return false
        }

        inputDom.val((inputValue * 1) + 1);
    });

    //eksiye tıklandığında
    $(document).on('click', '.js-count-minus', function(){
        let inputDom = $(this).parent().find('input'),
            inputValue = inputDom.val();

        if((inputValue * 1) <= 0) {
            return false
        }

        inputDom.val((inputValue * 1) - 1);
    });

    //modal close
    $(document).on('click', '.js-model-close', function(){
        $(this).parents('.modal').removeClass('is-active');
    });

    //modal aç
    $(document).on('click', '[data-target]', function(){
        var getModalId = $(this).data('target');

        $(getModalId).toggleClass('is-active');
    });

});