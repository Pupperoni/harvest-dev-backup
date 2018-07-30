/*
  Before diving, read or follow the jQuery QueryBuilder documentation here: https://querybuilder.js.org/;
                 know the basics of Javascript and jQuery
  
  The order of some components in this source is important. I would suggest to not rearrange the components.
*/

$(document).ready(function(){
  // settings used by the builder
  let options = {
    plugins: [
      'unique-filter'
    ],

    conditions: [],

    filters: [
      {
        id: 'xpath',
        label: 'Xpath',
        type: 'string',
        size: 81,
        unique: 'group',
        
      },
      {
        id: 'action',
        label: 'Action',
        type: 'string',
        unique: 'group',
        input: 'select',
        values: [
          'Header',
          'Cookie-header',
          'Fake-header'
        ]
      },
      {
        id: 'referrer',
        label: 'Referrer',
        type: 'string',
        size: 80,
        unique: 'group',
      },
      {
        id: 'user_agent',
        label: 'User Agent',
        type: 'boolean',
        input: 'radio',
        default_value: 'True',
        unique: 'group',
        values: [
          "True",
          "False"
        ]
      },
    ],
    allow_empty: true,
    // initial set of rules, rendered on the root group; we won't be using this for our purposes
    rules: {
      rules:[]
    },
    default_group_flags: {condition_readonly: true, no_add_group: true}
  };

  // aliasing for cleaner code
  let $b = $('#builder');

  let flags = {
    filter_readonly: true,  // filter input is disabled and cannot be changed
    no_delete: false,
    no_drop: false,
    no_sortable: false,
    operator_readonly: false,
    value_readonly: false
  }
  
  $b.on('afterAddRule.queryBuilder', function(d, e){
    $('.rule-operator-container').hide(); // hide unnecessary input box
    let group = $b.queryBuilder('getModel', $('#builder .rules-group-container').last());
    let rule = e; // this is an empty rule (no filters)
    // we've just added an empty rule
    if(group.rules[0] === e && group.id != "builder_group_1"){  // don't want the first rule in a group to be empty (must be xpath)
      let rule_a = $b.queryBuilder('addRule', group);             // make a new rule -- this is now the second rule in the current group (important!*)
      rule_a.filter = $b.queryBuilder('getFilterById', "xpath");  // set filter to xpath
      rule_a.flags = flags;
      $b.queryBuilder('deleteRule', rule);                        // delete the empty rule -- xpath rule is now the first rule :)
    }
    // *we only add this rule when we are sure that we are not deleting an empty rule from the previous condition
    else if(group.rules[0].filter && group.rules[0].filter.id == 'xpath' && group.rules[1] === e && group.id != "builder_group_1"){ // second rule in a group must be action
      let rule_a = $b.queryBuilder('addRule', group);             // make a new rule -- this should now be the third rule in the group
      rule_a.filter = $b.queryBuilder('getFilterById', "action"); // set filter to action
      rule_a.flags = flags;
      $b.queryBuilder('deleteRule', rule);                        // delete the empty rule -- action rule is now the second rule :)
      
      // hide delete buttons of xpath and action rules; these rules are required
      $('#'+rule_a.id+" div div").children("button").hide(); 
      $('#'+group.rules[0].id+" div div").children("button").hide();
    }
  });

  function set_up(){
    try{
      $b.queryBuilder('reset'); // this will reset all rules of the builder
    }
    catch(err){
      // builder has never been set up, ignore this error
    };

    $b.queryBuilder(options); // initialize the builder, uses settings defined in options

    let flags_init = {
        filter_readonly: true,  // filter input is disabled and cannot be changed
        no_delete: true,        // rule cannot be deleted
        no_drop: false,
        no_sortable: false,
        operator_readonly: false,
        value_readonly: false
      }

    // create the first set of rules
    $b.queryBuilder('setRules',{
      rules: [{
        rules: [{ // a group...
          "id":"xpath", // ...containing an xpath rule...
          "flags":flags_init // ...that cannot be deleted...
        },{
          "id":"action", // ...and an action rule...
          "flags":flags_init // ...that cannot be deleted either
        }],
      }],
      flags: {no_add_rule: true, no_add_group: false, no_delete: true} // root group cannot add new rules, only groups; also cannot be deleted
    });

    // hide the unusable delete button
    $('.btn-danger').hide();
  }

  // checks if the current web page is the file download verifier page, only initialize the builder if it is (if there is a better way of doing this, feel free to change it)
  if(window.location.pathname == '/granarytools/verify'){
    set_up();
  }

  $b.on('beforeAddRule.queryBuilder', function(d, e){
    if($(e).attr('rules').length == 4){ // only allow up to 4 rules per group
      d.preventDefault();
    }
  });

  // NOTE: adding a group will also add an empty rule inside by default: https://querybuilder.js.org/api/QueryBuilder.html#addGroup
  $b.on('afterAddGroup.queryBuilder',function(d, e){
    let group = $b.queryBuilder('getModel', $('#builder .rules-group-container').last());
    if(group.id != 'builder_group_0' && group.id != 'builder_group_1'){ // except the root group and the first init group 
      let rule_x = $b.queryBuilder('addRule',group); // add another rule (the second rule in the group)
    }
  });

  $b.on('afterUpdateRuleFilter.queryBuilder', function(d, e){
    if(e){
      // if filter chosen is referrer, add a link to copy the string inside the Download URL input box
      if(e.filter && e.filter.id == 'referrer' && $('#'+e.id+" .rule-value-container .download-url a").length == 0){
        let test = $('<div class="download-url" align="right"><a href="javascript:void(0);" class="set-url" style="padding-top: 20px"><sup>Use Download URL</sup></a></div>').click(function(){
          $('#'+e.id+' .rule-value-container input').val($('#url').val()).change();
        });
        let tr = $('#'+e.id+" .rule-value-container").append(test);
      }
      // remove it if other filters are chosen
      else if(e.filter == null || (e.filter && e.filter.id != 'referrer')){
        $('#'+e.id+" .rule-value-container .download-url").remove();
      }
    };
  });

  // when the Reset button is clicked, reset the builder and remove all alert boxes for a cleaner page
  $('#reset').on("click", function(){
    set_up();
    // $('#about-info .alert.alert-danger.alert-dismissible.fade.in.span8.offset2').remove();
    // $('#about-url .alert.alert-danger.alert-dismissible.fade.in.span8.offset2').remove();
    $('#about-visit .alert').remove();
  });

  $('form').on("submit", function(e){
    if(window.location.pathname == '/granarytools/verify'){ // we only do this on the file download verifier page
      let msg = "";
      $('#about-visit .alert').remove();
      if($('#url').val() == ""){  // Download URL input box is empty -- raise an error!
        msg += "No URL found!\n";
        // if($('#about-url .alert.alert-danger.alert-dismissible.fade.in').length == 0){
        //   let msg = $('#about-url').append('<div class="alert alert-danger alert-dismissible fade in span8 offset2" style="margin-top:2%"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>No URL found!</strong></div>');
        // }
        e.preventDefault();
      }
      else{
        // $('#about-url .alert.alert-danger.alert-dismissible.fade.in').remove();
      }
      try{
        rules = $b.queryBuilder('getRules');  // convert the rules in the builder into json
        rules.url = $('#url').val();
        $('#builder-data').val(JSON.stringify(rules)).change();
        // $('#about-info .alert.alert-danger.alert-dismissible.fade.in.span8.offset2').remove();
      }
      catch(err){ // something went wrong with the conversion -- raise an error!
        msg += "Missing information!"
        // if($('#about-info .alert.alert-danger.alert-dismissible.fade.in').length == 0){
        //   let msg = $('#about-info').append('<div class="alert alert-danger alert-dismissible fade in span8 offset2" style="margin-top:2%"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Missing information!</strong></div>');
        // }
        e.preventDefault();
      }
      if(msg != ""){  // alert the user of all his/her errors
        alert(msg);
      }
    }
  });
});
