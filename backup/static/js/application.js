// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

!function ($) {

  $(function(){
    var sidenav = $(' .tm-nav-list.bs-docs-sidenav');
    
    $('#page-navbar')
      .on('fixed', function () {        
        sidenav.css({
          position: 'fixed',
          top: 38
        }); 
      })
      .on('static', function () {  
        sidenav.css({
          position: '',
          top: ''
        }); 
      })
      .navbar();
    
    // Disable certain links in docs
    $('section [href^=#]:not([href="#git-workflow"], [href="#coding-guidelines"], [href="#review-process"], [href="#unit-tests"])').click(function (e) {
      var _e = $(e.target);
      e.preventDefault();
      if (_e.parent().is('.tm-dropdown-submenu')){
        return false;
      }      
    })
    
    // make code pretty
    window.prettyPrint && prettyPrint()

    // add-ons
    $('.add-on :checkbox').on('click', function () {
      var $this = $(this)
        , method = $this.attr('checked') ? 'addClass' : 'removeClass'
      $(this).parents('.add-on')[method]('active')
    })

    // add tipsies to grid for scaffolding    
    if ($('#gridSystem').length) {
      $('#gridSystem').tooltip({
          selector: '.show-grid > [class*="span"]',
          title: function () {            
            return $(this).width() + 'px'
          }
      })
    };
    //dropdowns example
    $(document)
      .on('mouseenter', '.bs-docs-example-submenus .tm-dropdown-submenu', function () {        
        //$(this).parent().parent().css('border', '1px solid red');
        //console.log($(this).parent().parent().is('.dropup'));
        $(this).parent().parent().parent().css('z-index', 1080);        
      })
      .on('mouseleave', '.bs-docs-example-submenus .tm-dropdown-submenu', function () {
        $(this).parent().parent().parent().css('z-index', 1);
        //console.log($(this).parent().parent().parent().css('z-index'));
      })
    
    var samplePercent = 0, samplePercentTimer, toggleFunction = function() {
      var _toggleBtn = $(this);
       $('#progress-bar-markup .bar').show();
      if (_toggleBtn.is('.active')) {
        _toggleBtn.text('Press to start');
        clearInterval(samplePercentTimer);
      } else {
        _toggleBtn.text('Press to stop');
        samplePercentTimer = setInterval (function () {
          samplePercent += 10;         
          $('#progress-bar-markup').progress('percentage', samplePercent);      
          if (samplePercent >= 100) clearInterval(samplePercentTimer);
        }, 500);
      }
    };
    $('#progress-bar-markup')
      .progress()    
      .bind('complete', function (e) {
        clearInterval(samplePercentTimer);
        var toggleBtn = $('#tm-progress-generate-toggle').text('Completed').off('click').removeAttr('data-toggle').removeClass('active').addClass('disabled');
        samplePercent = 0;        
        samplePercentTimer = setTimeout(function () {
          clearTimeout(samplePercentTimer);
          $('#progress-bar-markup .bar').hide().width('0%');
          $('#progress-bar-markup').progress('percentage', 0);
          toggleBtn.text('Press to start').attr('data-toggle', 'button').trigger('blur').on('click', toggleFunction).removeClass('disabled');
        }, 3000);
      });
    
    $('#tm-progress-generate-toggle').on('click', toggleFunction);

    //$('#progress-bar-markup').progress('speed', .5);
    

    // pagination demo
    $('#pagination-markup').pagination();
    $('#pagination-table-markup').pagination({view: 'table'});

    // tooltip demo
    $('.tooltip-demo').tooltip({
      selector: "a[data-toggle=tooltip]"
    });

    $('.tooltip-test').tooltip();
    $('.popover-test').popover();

    // popover demo
    $(".popoverDemo")
      .popover()
      .click(function(e) {
        e.preventDefault();
      });
    
    // alert demo
   
    $('#alert-initialize').alert({
      //"closable": true  
    });
    
    $("#tm-alert-generate").alert({
      "type": "info",
      "content": '<strong>Well done!</strong> This alert message will be closed or shown by <strong>close</strong> or <strong>show</strong> method.',
      "show": true,
      "closable": false  
    });
   
    $("#tm-alert-generate")
    .bind('close', function () {
      // do something?
      alert('close');
    })
    .bind('closed', function () {
      // do something?
      alert('closed');
    })
    .bind('show', function () {
      // do something?
      alert('show');
    })
    .bind('shown', function () {
      // do something?
      alert('shown');
    });
    
    
    $('#tm-alert-generate-toggle').click(function() {
      var _toggleBtn = $(this);      
      if (_toggleBtn.is('.active')) {
        _toggleBtn.text('Close alert');
        $("#tm-alert-generate").alert('show');
      } else {
        _toggleBtn.text('Show alert');
        $("#tm-alert-generate").alert('close');
      }
    });
    
    var dragStart = function (e) {
      //console.log(e);
      e.stopPropagation()
    }
    var dragEnd = function (e) {
      //console.log(e);
      e.stopPropagation()
    }
    // Splitter demo
    
    $('#default-splitter').splitter().bind({
        'dragStart': dragStart,
        'dragEnd': dragEnd        
      });
      
    $('#vertical-splitter').splitter({
      direction: 'vertical'
    }).bind({
        'dragStart': dragStart,
        'dragEnd': dragEnd        
      });
      
    $('#multiple-horizontal-splitter').splitter({
     // 'realtime': true
    })
      .bind({
        'dragStart': dragStart,
        'dragEnd': dragEnd        
      });
      
    $('#multiple-vertical-1, #multiple-vertical-2').splitter({
      direction: 'vertical'     
    }).bind({
        'dragStart': dragStart,
        'dragEnd': dragEnd        
      }); 
    $('#multiple-vertical-3').splitter()
    // button state demo
    $('#fat-btn')
      .click(function () {
        var btn = $(this)
        btn.button('loading')
        setTimeout(function () {
          btn.button('reset')
        }, 3000)
      });
    
    // Dropdown Menu demo
		$(".dropdown-toggle").dropdown();
		
		// Modal demo		
    $("#myDefaultModal").modal({
      type: "default",
      header: "Default modal",
      content: "This is the default modal which is useful for displaying information. The dialog window can be closed with the 'x' icon.",
      buttons: [{
        text: "Close",
        dismiss: true
      }],
      show: false
    });
		
    
		// Loading Modal demo		
    $("#myLoadingModal").modal({
      type: "loading",
      show: false
    });
		

		// Notification Modal demo		
    $("#myNotificationModal").modal({
      type: "warning",
      title: "Warning! Virus detected",      
      content: "Threat detected: Trojan-IM.Win32.Faker.a",
      buttons: [{
        text: "Remove all",
        dismiss: true          
      }]
      ,show: false
    });
		
		
		// Selection (Add/Remove List) demo
		$("#mySelection").selection({
			source: [{
				value: 1,
				text: "Item 1"
			},
			{
				value: 2,
				text: "Item 2"
			},
			{
				value: 2,
				text: "Item 2"
			}]
		});    
    
    // Architecture modal diagram
    $("#diagram-architecture").modal({
      show: false,
      toggle: 'modal'
    });

    // Less variables modal diagram
    $("#diagram-less-var").modal({
      show: false,
      toggle: 'modal'
    });

    // Less computed modal diagram
    $("#diagram-less-computed").modal({
      show: false,
      toggle: 'modal'
    });    

    // Git setup modal diagram
    $("#diagram-git-setup").modal({
      show: false,
      toggle: 'modal'
    }); 

    // Git branching modal diagram
    $("#diagram-git-branching").modal({
      show: false,
      toggle: 'modal'
    }); 

    // Git pushing modal diagram
    $("#diagram-git-pushing").modal({
      show: false,
      toggle: 'modal'
    }); 

    // Git merging modal diagram
    $("#diagram-git-merging").modal({
      show: false,
      toggle: 'modal'
    }); 

    // Plugin modal diagram
    $("#diagram-plugin-guide").modal({
      show: false,
      toggle: 'modal'
    }); 

    // Plugin extend modal diagram
    $("#diagram-plugin-extend-guide").modal({
      show: false,
      toggle: 'modal'
    }); 

    // carousel demo
    $('#myCarousel').carousel();

    // validation example
    $('#validationExample').validation({
      debug: true,
      rules: {
        labelEmail: {
          email: true
        },
        labelPassword: {
          minlength: 6
        },
        labelRepeatPassword: {
          equalTo: '#labelPassword'
        }
      },
      messages: {
        labelRepeatPassword: {
          equalTo: 'Please retype the same password.'
        }
      }
    })

    // accordion sample
    $('#accordion2').collapse({toggle:false});

    // toggler sample
    $('input[data-role=toggler]').toggler();

    // javascript build logic
    var inputsComponent = $("#components.download input")
      , inputsPlugin = $("#plugins.download input")
      , inputsVariables = $("#variables.download input")
      , requirePlgin = $("#plugins.download input[require]");

    // toggle all plugin checkboxes
    $('#components.download .toggle-all').on('click', function (e) {      
      e.preventDefault();
      if (inputsComponent.is(':checked')) {
        inputsComponent.attr('checked', false);
      } else {
        inputsComponent.each(function (i, item) {
          item.checked = true;
        });     	
      }
    });

    $('#plugins.download .toggle-all').on('click', function (e) {
      e.preventDefault();      
      if (inputsPlugin.is(':checked')) {
        inputsPlugin.attr('checked', false);
      } else {
        inputsPlugin.each(function (i, item) {
          item.checked = true;
        });     	
      }
    });

    requirePlgin.on('change', function (e) {
      e.preventDefault();
      var thisPlug = $(this);
      var requiredPlug = $("#plugins.download input[name='" + thisPlug.attr('require') + "']");
      if (thisPlug.is(":checked")) {
         requiredPlug[0].checked = true;
      }
    });

    /*
    $('#variables.download .toggle-all').on('click', function (e) {
      e.preventDefault();
      inputsVariables.val('');
    });*/
    
    function restoreChanged(control) { 
	  control.val('');
      return '';
    }
    $('#alert-changed-preview').on('click', function (e) {
      e.preventDefault();
      less.modifyVars({
        '@AlertRadius': $('#alert-radius').val() || $('#alert-radius').attr('placeholder'),
        '@AlertPadding': $('#alert-padding').val() || $('#alert-padding').attr('placeholder'),
        '@AlertPaddingTop': $('#alert-padding-top').val() || $('#alert-padding-top').attr('placeholder'),
        '@AlertPaddingBottom': $('#alert-padding-bottom').val() || $('#alert-padding-bottom').attr('placeholder'),
        '@AlertPaddingLeft': $('#alert-padding-left').val() || $('#alert-padding-left').attr('placeholder'),
        '@AlertPaddingRight': $('#alert-padding-right').val() || $('#alert-padding-right').attr('placeholder'),
        '@warningBorder': $('#alert-waring-border').val() || $('#alert-waring-border').attr('placeholder'),
        '@warningBackground': $('#alert-waring-background').val() || $('#alert-waring-background').attr('placeholder')
      }); 
    });
    
    $('#alert-restore').on('click', function (e) {
      e.preventDefault();
      less.modifyVars({
        '@AlertRadius': restoreChanged($('#alert-radius')) || $('#alert-radius').attr('placeholder'),
        '@AlertPadding': restoreChanged($('#alert-padding')) || $('#alert-padding').attr('placeholder'),
        '@AlertPaddingTop': restoreChanged($('#alert-padding-top')) || $('#alert-padding-top').attr('placeholder'),
        '@AlertPaddingBottom': restoreChanged($('#alert-padding-bottom')) || $('#alert-padding-bottom').attr('placeholder'),
        '@AlertPaddingLeft': restoreChanged($('#alert-padding-left')) || $('#alert-padding-left').attr('placeholder'),
        '@AlertPaddingRight': restoreChanged($('#alert-padding-right')) || $('#alert-padding-right').attr('placeholder'),
        '@warningBorder': restoreChanged($('#alert-waring-border')) || $('#alert-waring-border').attr('placeholder'),
        '@warningBackground': restoreChanged($('#alert-waring-background')) || $('#alert-waring-background').attr('placeholder')
      });            
    });
    
    
    // request built javascript
    $('.download-btn .btn').on('click', function () {

      var css = $("#components.download input:checked")
            .map(function () { return this.value })
            .toArray()
        , js = $("#plugins.download input:checked")
            .map(function () { return this.value })
            .toArray()
        , vars = {}
        , img = ['glyphicons-halflings.png', 'glyphicons-halflings-white.png'];

    $("#variables.download input")
      .each(function () {
        $(this).val() && (vars[ $(this).prev().text() ] = $(this).val());
      });

      $.ajax({
        type: 'POST'
      , url: /\?dev/.test(window.location) ? 'http://localhost:3000' : 'http://bootstrap.herokuapp.com'
      , dataType: 'jsonpi'
      , params: {
          js: js
        , css: css
        , vars: vars
        , img: img
      }
      });
    });
  });

  // Modified from the original jsonpi https://github.com/benvinegar/jquery-jsonpi
  $.ajaxTransport('jsonpi', function(opts, originalOptions, jqXHR) {
    var url = opts.url;

    return {
      send: function(_, completeCallback) {
        var name = 'jQuery_iframe_' + jQuery.now()
          , iframe, form;

        iframe = $('<iframe>')
          .attr('name', name)
          .appendTo('head');

        form = $('<form>')
          .attr('method', opts.type) // GET or POST
          .attr('action', url)
          .attr('target', name);

        $.each(opts.params, function(k, v) {

          $('<input>')
            .attr('type', 'hidden')
            .attr('name', k)
            .attr('value', typeof v == 'string' ? v : JSON.stringify(v))
            .appendTo(form);
        })

        form.appendTo('body').submit();
      }
    }
  });
}(window.jQuery);
