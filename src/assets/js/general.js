function addtocart(itemid){
  var token = '';

  if($('[name="csrf_digi_name"]').length){
    token = document.getElementsByName('csrf_digi_name')[0].value;
  }
  
  var jainitem=$('#itemjain'+itemid+':checked').val();
  if(jainitem=='undefined'){
    jainitem='';
  }
  

  var data = 'itemid=' +itemid;
      data += '&itemquantity=1';
      data += '&jainitem='+jainitem;
      data += '&csrf_digi_name='+token;


  $.ajax({
    type:'POST',
    url:base_url+'order/add_cart_item/',
    data:data,
    dataType: "json",
    success:function(result){
      var msg = result.msg;
      if(msg=='cartinsert'){
        Swal.fire({
          icon: 'success',
          title: 'item successfully added to your cart',
          showConfirmButton: false,
          timer: 500
        })
        $("#totalcartitem").html(result.ftotalitem);
      }else if(msg=='alreadyexisted'){
        Swal.fire({
          icon: 'warning',
          title: 'item already existed in Cart',
          showConfirmButton: false,
          timer: 500
        })
      }else if(msg=='error'){
        Swal.fire({
          icon: 'error',
          title: 'Something went wrong',
          showConfirmButton: false,
          timer: 500
        })
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Something went wrong',
          showConfirmButton: false,
          timer: 500
        })
      }      
      return false;
    }
  });
}
function addtocartaddonse(itemid){
  var token = '';

  if($('[name="csrf_digi_name"]').length){
    token = document.getElementsByName('csrf_digi_name')[0].value;
  }

  var data = 'itemid=' +itemid;
      data += '&itemquantity=1';
      data += '&csrf_digi_name='+token;


  $.ajax({
    type:'POST',
    url:base_url+'order/add_cart_item/',
    data:data,
    dataType: "json",
    success:function(result){
      var msg = result.msg;
      if(msg=='cartinsert'){
        Swal.fire({
          icon: 'success',
          title: 'item successfully added to your cart',
          showConfirmButton: false,
          timer: 500
        })
        $("#totalcartitem").html(result.ftotalitem);
        window.location.reload();
      }else if(msg=='alreadyexisted'){
        Swal.fire({
          icon: 'warning',
          title: 'item already existed in Cart',
          showConfirmButton: false,
          timer: 500
        })
      }else if(msg=='error'){
        Swal.fire({
          icon: 'error',
          title: 'Something went wrong',
          showConfirmButton: false,
          timer: 500
        })
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Something went wrong',
          showConfirmButton: false,
          timer: 500
        })
      }      
      return false;
    }
  });
}
function Get_Single_Item(itemid) {
  var data = 'itemid=' +itemid;
  
  if (itemid>0){    
    $("#adons-options-block").empty();
    $('#addons-options-modal').modal('hide');
    $("body").addClass("ajax-load");
    $.ajax({
      type:'POST',
      url:base_url+'order/Get_Single_Item/',
      data:data,
      dataType: "json",
      success:function(result){
        $("body").removeClass("ajax-load");
        if (result.msg=='getinfo') {
          $("#adons-options-block").html(result.data);      
          $('#addons-options-modal').modal('show');
        } else {
          $("#adons-options-block").empty();
          $('#addons-options-modal').modal('hide');
        }
        return false;
      }
    });    
  }
}
// FOR POPUP
function get_item_addons_variation(itemid) {
  var data = 'itemid=' +itemid;
  
  if (itemid>0){    
    $("#adons-options-block").empty();
    $('#addons-options-modal').modal('hide');
    $("body").addClass("ajax-load");
    $.ajax({
      type:'POST',
      url:base_url+'order/get_item_addons_variation/',
      data:data,
      dataType: "json",
      success:function(result){
        $("body").removeClass("ajax-load");
        if (result.msg=='getinfo') {
          $("#adons-options-block").html(result.data);      
          $('#addons-options-modal').modal('show');
        } else {
          $("#adons-options-block").empty();
          $('#addons-options-modal').modal('hide');
        }
        return false;
      }
    });    
  }
}
function update_variation_cost(variationid){
  var variation_cost = 0;
  var item_id    = 0;  
  var modl = "#addons-options-modal";  
  item_id   = $(""+modl+" #selected_item_id").val();
  var  final_cost=$('#totalcost'+item_id).val();
  if($(''+modl+' input[id="itemvariationid'+item_id+variationid+'"]:checked').attr('data-val')) {    
    var itemvariationprice   = parseFloat($(''+modl+' input[id="itemvariationid'+item_id+variationid+'"]:checked').attr('data-val'));
    var itemvariationqty   = $('#itemvariationqty'+item_id+variationid).val();
    var variation_cost=(itemvariationprice*itemvariationqty);
    final_cost = parseFloat(final_cost)+parseFloat(variation_cost);
    final_cost = (final_cost).toFixed(2);
    $('#hp_final_cost').html(final_cost);
    $('#totalcost'+item_id).val(final_cost);
  }else{
    var itemvariationprice   = parseFloat($(''+modl+' input[id="itemvariationid'+item_id+variationid+'"]').attr('data-val'));
    var itemvariationqty   = $('#itemvariationqty'+item_id+variationid).val();
    var variation_cost=(itemvariationprice*itemvariationqty);
    final_cost = parseFloat(final_cost)-parseFloat(variation_cost);
    final_cost = (final_cost).toFixed(2);
    $('#hp_final_cost').html(final_cost);
    $('#totalcost'+item_id).val(final_cost);
  }  
}
function update_addon_cost(addonid){
  var addon_cost = 0;
  var item_id    = 0;  
  var modl = "#addons-options-modal";  
  item_id   = $(""+modl+" #selected_item_id").val();
  var  final_cost=$('#totalcost'+item_id).val();
  if($(''+modl+' input[id="itemaddonid'+item_id+addonid+'"]:checked').attr('data-val')) {    
    var itemvaddonprice   = parseFloat($(''+modl+' input[id="itemaddonid'+item_id+addonid+'"]:checked').attr('data-val'));
    var itemaddonqty   = $('#itemaddonqty'+item_id+addonid).val();
    var addon_cost=(itemvaddonprice*itemaddonqty);
    final_cost = parseFloat(final_cost)+parseFloat(addon_cost);
    final_cost = (final_cost).toFixed(2);
    $('#hp_final_cost').html(final_cost);
    $('#totalcost'+item_id).val(final_cost);
  }else{
    var itemvaddonprice   = parseFloat($(''+modl+' input[id="itemaddonid'+item_id+addonid+'"]').attr('data-val'));
    var itemaddonqty   = $('#itemaddonqty'+item_id+addonid).val();
    var addon_cost=(itemvaddonprice*itemaddonqty);
    final_cost = parseFloat(final_cost)-parseFloat(addon_cost);
    final_cost = (final_cost).toFixed(2);
    $('#hp_final_cost').html(final_cost);
    $('#totalcost'+item_id).val(final_cost);
  }  
}
function increase_decrease_addonqty(itemid,addonid,increasedecrease){
  var currentqty   = $("#itemaddonqty"+itemid+addonid).val();
  if(increasedecrease=='1'){
    var currentVal = parseFloat(currentqty);
    if(currentVal>0 || currentVal==0){
      var itemaddonplus = parseFloat(currentVal)+parseFloat('1');
      $('#itemaddonqty'+itemid+addonid).val(itemaddonplus);
      $('#addonqty'+itemid+addonid).val(itemaddonplus);
      var modl = "#addons-options-modal";  
      //if($(''+modl+' input[id="itemaddonid'+itemid+addonid+'"]:checked').attr('data-val')) {    
        //var itemvaddonprice   = parseFloat($(''+modl+' input[id="itemaddonid'+itemid+addonid+'"]:checked').attr('data-val'));
        var item   = $('#itemaddonid'+itemid+addonid).prop("checked", true);
        var itemvaddonprice   = parseFloat($(''+modl+' input[id="itemaddonid'+itemid+addonid+'"]').attr('data-val'));
        var itemaddonqty   = itemaddonplus;
        var addon_cost=(itemvaddonprice*itemaddonqty);
        var  final_cost=$('#totalcost'+itemid).val();
        final_cost = parseFloat(final_cost)+parseFloat(addon_cost);
        // old price remove
        var oldpricecalculate = (itemvaddonprice*currentVal);
        final_cost = parseFloat(final_cost)-parseFloat(oldpricecalculate);

        final_cost = (final_cost).toFixed(2);
        $('#hp_final_cost').html(final_cost);
        $('#totalcost'+itemid).val(final_cost);
      //}
    }
  }
  if(increasedecrease=='0'){
    var currentVal = parseFloat(currentqty);
    if(currentVal>0){
      var itemaddonplus = parseFloat(currentVal)-parseFloat('1');
      $('#itemaddonqty'+itemid+addonid).val(itemaddonplus);
      $('#addonqty'+itemid+addonid).val(itemaddonplus);
      var modl = "#addons-options-modal";  
      //if($(''+modl+' input[id="itemaddonid'+itemid+addonid+'"]:checked').attr('data-val')) {   
        var item   = $('#itemaddonid'+itemid+addonid).prop("checked", true);
        var itemvaddonprice   = parseFloat($(''+modl+' input[id="itemaddonid'+itemid+addonid+'"]').attr('data-val')); 
        //var itemvaddonprice   = parseFloat($(''+modl+' input[id="itemaddonid'+itemid+addonid+'"]:checked').attr('data-val'));
        var itemaddonqty   = itemaddonplus;
        var addon_cost=(itemvaddonprice*itemaddonqty);
        var  final_cost=$('#totalcost'+itemid).val();
        final_cost = parseFloat(final_cost)+parseFloat(addon_cost);
        // old price remove
        var oldpricecalculate = (itemvaddonprice*currentVal);
        final_cost = parseFloat(final_cost)-parseFloat(oldpricecalculate);

        final_cost = (final_cost).toFixed(2);
        $('#hp_final_cost').html(final_cost);
        $('#totalcost'+itemid).val(final_cost);
      //}
    }else{
      var item   = $('#itemaddonid'+itemid+addonid).prop("checked", false);
    }
  }
}
function increase_decrease_variationqty(itemid,variationid,increasedecrease){
  var currentqty   = $("#itemvariationqty"+itemid+variationid).val();
  if(increasedecrease=='1'){
    var currentVal = parseFloat(currentqty);
    if(currentVal>0 || currentVal==0){
      var itemvariationplus = parseFloat(currentVal)+parseFloat('1');
      $('#itemvariationqty'+itemid+variationid).val(itemvariationplus);
      $('#variationqty'+itemid+variationid).val(itemvariationplus);
      var modl = "#addons-options-modal";  
      //if($(''+modl+' input[id="itemvariationid'+itemid+variationid+'"]:checked').attr('data-val')) {    
        //var itemvariationprice   = parseFloat($(''+modl+' input[id="itemvariationid'+itemid+variationid+'"]:checked').attr('data-val'));
        $('#itemvariationid'+itemid+variationid).prop("checked", true);
        var itemvariationprice   = parseFloat($(''+modl+' input[id="itemvariationid'+itemid+variationid+'"]').attr('data-val'));
        var itemvariationqty   = itemvariationplus;
        var variation_cost=(itemvariationprice*itemvariationqty);
        var  final_cost=$('#totalcost'+itemid).val();
        final_cost = parseFloat(final_cost)+parseFloat(variation_cost);
        // old price remove
        var oldpricecalculate = (itemvariationprice*currentVal);
        final_cost = parseFloat(final_cost)-parseFloat(oldpricecalculate);

        final_cost = (final_cost).toFixed(2);
        $('#hp_final_cost').html(final_cost);
        $('#totalcost'+itemid).val(final_cost);
      //}
    }
  }
  if(increasedecrease=='0'){
    var currentVal = parseFloat(currentqty);
    if(currentVal==1){
      //$('#itemvariationid'+itemid+variationid).prop("checked", false);
    }
    if(currentVal>0){
      var itemvariationplus = parseFloat(currentVal)-parseFloat('1');
      $('#itemvariationqty'+itemid+variationid).val(itemvariationplus);
      $('#variationqty'+itemid+variationid).val(itemvariationplus);
      var modl = "#addons-options-modal";  
      //if($(''+modl+' input[id="itemvariationid'+itemid+variationid+'"]:checked').attr('data-val')) {   
        var item   = $('#itemvariationid'+itemid+variationid).prop("checked", true);
        var itemvariationprice   = parseFloat($(''+modl+' input[id="itemvariationid'+itemid+variationid+'"]').attr('data-val')); 
        //var itemvariationprice   = parseFloat($(''+modl+' input[id="itemvariationid'+itemid+variationid+'"]:checked').attr('data-val'));
        var itemvariationqty   = itemvariationplus;
        var variation_cost=(itemvariationprice*itemvariationqty);
        var  final_cost=$('#totalcost'+itemid).val();
        final_cost = parseFloat(final_cost)+parseFloat(variation_cost);
        // old price remove
        var oldpricecalculate = (itemvariationprice*currentVal);
        final_cost = parseFloat(final_cost)-parseFloat(oldpricecalculate);

        final_cost = (final_cost).toFixed(2);
        $('#hp_final_cost').html(final_cost);
        $('#totalcost'+itemid).val(final_cost);
      //}
    }else{
      //$('#itemvariationid'+itemid+variationid).prop("checked", false);
    }
  }
}
function addToCarts(itemid)
{
  var message  = "";
  var itemFrom   = 'items';
  var item_id    =itemid;
  var menu_id    = 0;
  var item_cost  = 0;
  var item_option_price=0;
  var item_option_id=0;
  var index = 0;
  var addtocartform='';

  var modl = "#addons-options-modal";
  addtocartform = $('#addtocartform').serialize();
  item_id   = $(""+modl+" #selected_item_id").val();
  menu_id   = $(""+modl+" #selected_menu_id").val();
  item_cost   = $(""+modl+" #selected_item_price").val();
  itemFrom    = $(""+modl+" #itemFrom").val();
  var itemquantity = 1;    
  if (itemFrom!='' && item_id>0 && menu_id>0) {
    // var token = '';
    // if($('[name="csrf_test_name"]').length){
    //   token = document.getElementsByName('csrf_test_name')[0].value;
    // }
    // alert(token);
    var passdata  = addtocartform;
        passdata += "&itemid="+item_id;
        passdata += "&item_price="+item_cost;
        passdata += "&categoryid="+menu_id;
        passdata += "&itemFrom="+itemFrom;
        passdata += "&itemquantity="+itemquantity;
    //$("body").addClass("ajax-load");
    $.ajax({
      type:'POST',
      url:base_url+'order/add_cart_item/',
      data:passdata,
      dataType: "json",
      success:function(result){
        $("body").removeClass("ajax-load");
        $("#adons-options-block").empty();
        $('#addons-options-modal').modal('hide');
        var msg = result.msg;
        if(msg=='cartinsert'){
          Swal.fire({
            icon: 'success',
            title: 'item successfully added to your cart',
            showConfirmButton: false,
            timer: 1500
          })
          $("#totalcartitem").html(result.ftotalitem);
        }else if(msg=='alreadyexisted'){
          Swal.fire({
            icon: 'warning',
            title: 'item already existed in Cart',
            showConfirmButton: false,
            timer: 1500
          })
        }else if(msg=='error'){
          Swal.fire({
            icon: 'error',
            title: 'Something went wrong',
            showConfirmButton: false,
            timer: 1500
          })
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Something went wrong',
            showConfirmButton: false,
            timer: 1500
          })
        }      
        return false;
      }
    });
  } else {
    window.location.reload();
  }    
}
//type='decr/incr', id='id_rowid', qty, offers/''
function update_qty(rowid,type,itemFrom='')
{
  if(rowid!='' && type!='' && itemFrom!=''){
    var data = 'rowid='+rowid;
        data += '&type='+type;
        data += '&itemFrom='+itemFrom;

    $.ajax({
      type:'POST',
      url:base_url+'order/update_qty/',
      data:data,
      dataType: "json",
      success:function(result){
        window.location.reload();
        //load_cart_div();
        return false;
      }
    });
  }else{
    window.location.reload();
  }
}
function load_cart_div()
{
  $("body").addClass("ajax-load");
  var data = 'itemid=1';
  $.ajax({
    type:'POST',
    url:base_url+'order/load_cart_div/',
    data:data,
    success:function(result){
      $("body").removeClass("ajax-load");
      $('#cartdetails').html(result);
      return false;
    }
  });
}

function get_item_addons_variation_for_customize(itemid,rowid) {
  var data = 'itemid=' +itemid;
      data += '&rowid=' +rowid;
  
  if (itemid!='' && rowid!=''){    
    $("#adons-options-block").empty();
    $('#addons-options-modal').modal('hide');
    //$("body").addClass("ajax-load");
    $.ajax({
      type:'POST',
      url:base_url+'order/get_item_addons_variation_for_customize/',
      data:data,
      dataType: "json",
      success:function(result){
        $("body").removeClass("ajax-load");
        if (result.msg=='getinfo') {
          $("#adons-options-block").html(result.data);      
          $('#addons-options-modal').modal('show');
        } else {
          $("#adons-options-block").empty();
          $('#addons-options-modal').modal('hide');
        }
        return false;
      }
    });    
  }
}
function update_cost()
{
  var final_cost = 0;
  var addon_cost = 0;
  var item_id    = 0;
  var item_cost  = 0;
  var item_variation_price=0;   
  var modl = "#addons-options-modal";  
  item_id   = $(""+modl+" #selected_item_id").val();
  item_cost   = $(""+modl+" #selected_item_price").val();  
  // if($(''+modl+' input[name="item_variation_id"]:checked').attr('data-val')) {    
  //   item_variation_price = parseFloat($(''+modl+' input[name="item_variation_id"]:checked').attr('data-val'));    
  //   item_cost = item_variation_price;  
  // }
  $(''+modl+' .form-check-input-variation:checked').each(function() {
    item_variation_price += parseFloat($(this).attr('data-val'));
    item_cost = item_variation_price; 
  });

  $(''+modl+' .form-check-input-addon input:checked').each(function() {
    addon_cost += parseFloat($(this).attr('data-val'));
  });
  final_cost = parseFloat(final_cost)+parseFloat(addon_cost)+parseFloat(item_cost);
  final_cost = (final_cost).toFixed(2);
  $('#hp_final_cost').html(final_cost);
}
//UPDATE TO CART - POPUP - CUSTOMIZE
function updateToCart(itemid) {
  
  var message  = "";
  var itemFrom   = 'items';
  var item_id    =itemid;
  var menu_id    = 0;
  var item_cost  = 0;
  var item_option_price=0;
  var item_option_id=0;
  var addon_ids = 0;
  var index = 0;
  var updatetocartform='';
  var modl = "#addons-options-modal";
  updatetocartform = $('#updatetocartform').serialize();
  item_id   = $(""+modl+" #selected_item_id").val();
  menu_id   = $(""+modl+" #selected_menu_id").val();
  item_cost   = $(""+modl+" #selected_item_price").val();
  itemFrom    = $(""+modl+" #itemFrom").val();
  var itemquantity = 1;    
  var rowid   = $(""+modl+" #rowid").val();
  if (itemFrom!='' && item_id>0 && menu_id>0 && rowid!='') {
    var passdata  = updatetocartform;
        passdata += "&itemid="+item_id;
        passdata += "&item_price="+item_cost;
        passdata += "&categoryid="+menu_id;
        passdata += "&itemFrom="+itemFrom;
        passdata += "&itemquantity="+itemquantity;
        passdata += "&rowid="+rowid;
    //$("body").addClass("ajax-load");
    $.ajax({
      type:'POST',
      url:base_url+'order/update_cart_item/',
      data:passdata,
      dataType: "json",
      success:function(result){
        
        $("body").removeClass("ajax-load");
        $("#adons-options-block").empty();
        $('#addons-options-modal').modal('hide');
        var msg = result.msg;
        if(msg=='cartinsert'){
          window.location.reload();
        }else if(msg=='notexisted'){
          Swal.fire({
            icon: 'warning',
            title: 'item not existed in Cart',
            showConfirmButton: false,
            timer: 1500
          })
        }else if(msg=='error'){
          Swal.fire({
            icon: 'error',
            title: 'Something went wrong',
            showConfirmButton: false,
            timer: 1500
          })
        }else{
          Swal.fire({
            
            icon: 'error',
            title: 'Something went wrong',
            showConfirmButton: false,
            timer: 1500
          })
        }      
        return false;
      }
    });
  } else {
    window.location.reload();
  }
}
function paytimelogin(){
  var data = 'paytimelogin=1';
  $.ajax({
    type:'POST',
    url:base_url+'order/paytimelogin/',
    data:data,
    dataType: "json",
    success:function(result){
      var msg = result.msg;
      if(msg=='alreadylogin'){
        window.location.reload();
      }else if(msg=='loginpopupopen'){
        $('#login-popup-modal').modal('show');
      }else{
        window.location.reload();
      }      
      return false;
    }
  });
}
// Send Withhout OTP
function sendotp(){
  var mobileno = $('#mobilenumber').val();
  var customername = $('#customername').val();
  var email = $('#email').val();
  var emailRegex=/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  var token = '';
  if($('[name="csrf_digi_name"]').length){
    token = document.getElementsByName('csrf_digi_name')[0].value;
  }
  if (customername=='') { 
    Swal.fire('Please Enter your name.');         
    return false;
  }
  if (mobileno!= '' && !mobileno.match('^[0-9]+$')) { 
    Swal.fire('Please Enter valid Mobile Number only 10 digit.');         
    return false;
  }
  var mobileno_len = $("#mobilenumber").val().length;
  if(mobileno_len>10 || mobileno_len<=9) {
    Swal.fire('Please Enter valid Mobile Number only 10 digit.');                 
    return false;
  }
  var data = 'mobilenumber='+mobileno;
      data += '&customername='+customername;
      data += '&email='+email;
      data += '&csrf_digi_name='+token;  
  $.ajax({
    type:'POST',
    url:base_url+'order/sendotp/',
    data:data,
    dataType: "json",
    success:function(result){
      $('#login-popup-modal').modal('hide');
      var msg = result.msg;
      if(msg=='verify'){
        window.location.href = base_url+'order/checkout/';   
      }
      if(msg=='notverify'){
        window.location.href = base_url+'order/placeorder/';   
      }
      if(msg=='error'){
        window.location.reload();   
      }     
      return false;
    }
  });
    
}
function sendotpwithsms(){
  var mobileno = $('#mobilenumber').val();
  var customername = $('#customername').val();
  var email = $('#email').val();
  var emailRegex=/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  var token = '';
  if($('[name="csrf_digi_name"]').length){
    token = document.getElementsByName('csrf_digi_name')[0].value;
  }
  if (customername=='') { 
    Swal.fire('Please Enter your name.');         
    return false;
  }
  if (mobileno!= '' && !mobileno.match('^[0-9]+$')) { 
    Swal.fire('Please Enter valid Mobile Number only 10 digit.');         
    return false;
  }
  var mobileno_len = $("#mobilenumber").val().length;
  if(mobileno_len>10 || mobileno_len<=9) {
    Swal.fire('Please Enter valid Mobile Number only 10 digit.');                 
    return false;
  }
  var data = 'mobilenumber='+mobileno;
      data += '&customername='+customername;
      data += '&email='+email;
      data += '&csrf_digi_name='+token;
    
  $.ajax({
    type:'POST',
    url:base_url+'order/mobilenumberverify/',
    data:data,
    dataType: "json",
    success:function(result){
      var msg = result.msg;
      if(msg=='sendnotification'){
          var data = 'mobilenumber='+mobileno;
              data += '&customername='+customername;
              data += '&email='+email;
              data += '&csrf_digi_name='+token;
          $.ajax({
            type:'POST',
            url:base_url+'order/sendotp/',
            data:data,
            dataType: "json",
            success:function(result){
              var msg = result.msg;
              if(msg=='otpsendnotverify'){
                 $('#login-popup-modal').modal('hide');
                 $('#sendtonumber').html('OTP sent to '+mobileno+'');
                 $('#login-verify-popup-modal').modal('show');
              }else{
                window.location.reload();
              }      
              return false;
            }
          });
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: result.message
        })        
        return false;
        window.location.reload();
      }      
      return false;
    }
  });
}
function sendotp_bk(){
  var mobileno = $('#mobilenumber').val();
  var customername = $('#customername').val();
  var email = $('#email').val();
  var emailRegex=/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  var token = '';
  if($('[name="csrf_digi_name"]').length){
    token = document.getElementsByName('csrf_digi_name')[0].value;
  }
  if (customername=='') { 
    Swal.fire('Please Enter your name.');         
    return false;
  }
  if (mobileno!= '' && !mobileno.match('^[0-9]+$')) { 
    Swal.fire('Please Enter valid Mobile Number only 10 digit.');         
    return false;
  }
  var mobileno_len = $("#mobilenumber").val().length;
  if(mobileno_len>10 || mobileno_len<=9) {
    Swal.fire('Please Enter valid Mobile Number only 10 digit.');                 
    return false;
  }
  var data = 'mobilenumber='+mobileno;
      data += '&customername='+customername;
      data += '&email='+email;
      data += '&csrf_digi_name='+token;
  $.ajax({
    type:'POST',
    url:base_url+'order/sendotp/',
    data:data,
    dataType: "json",
    success:function(result){
      var msg = result.msg;
      if(msg=='otpsendnotverify'){
         $('#login-popup-modal').modal('hide');
         $('#sendtonumber').html('OTP sent to '+mobileno+'');
         $('#login-verify-popup-modal').modal('show');
      }else{
        window.location.reload();
      }      
      return false;
    }
  });
}
function verifyotp(){
  var verifyotp = $('#verifyotp').val();
  if (verifyotp!= '' && !verifyotp.match('^[0-9]+$')) { 
    Swal.fire('Please Enter valid OTP.');         
    return false;
  }
  var verifyotp_len = $("#verifyotp").val().length;
  if(verifyotp_len>4 || verifyotp<=3) {
    Swal.fire('Please Enter valid OTP.');                 
    return false;
  }
  var data = 'verifyotp='+verifyotp;
  $.ajax({
    type:'POST',
    url:base_url+'order/verifyotp/',
    data:data,
    dataType: "json",
    success:function(result){
      var msg = result.msg;
      if(msg=='error'){
        $('#login-verify-popup-modal').modal('show');
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: result.message
        })        
        return false;
      }
      if(msg=='success'){
        window.location.reload();
      }      
      return false;
    }
  });
}
function paytimesignup(){  
  var mobileno = $('#csmobilenumber').val();
  var customername = $('#cscustomername').val();
  var email = $('#csemail').val();
  var emailRegex=/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  var token = '';
  if($('[name="csrf_digi_name"]').length){
    token = document.getElementsByName('csrf_digi_name')[0].value;
  }
  if (customername=='') { 
    Swal.fire('Please Enter your name.');         
    return false;
  }
  if (mobileno!= '' && !mobileno.match('^[0-9]+$')) { 
    Swal.fire('Please Enter valid Mobile Number only 10 digit.');         
    return false;
  }
  var mobileno_len = $("#csmobilenumber").val().length;
  if(mobileno_len>10 || mobileno_len<=9) {
    Swal.fire('Please Enter valid Mobile Number only 10 digit.');                 
    return false;
  }
  if(email==''){
    Swal.fire('Please Enter Your Valid Email Id.');                  
    return false;
  }
  if(!emailRegex.test(email)){
    Swal.fire('Please Enter Your Valid Email Id.');  
    return false;
  }

   var data = 'mobilenumber='+mobileno;
      data += '&customername='+customername;
      data += '&email='+email;
      data += '&csrf_digi_name='+token;
    $.ajax({
        type:'POST',
        url:base_url+'order/sendotp/',
        data:data,
        dataType: "json",
        success:function(result){
          $('#login-popup-modal').modal('hide');
          var msg = result.msg;
          if(msg=='verify'){
            window.location.href = base_url+'order/placeorder/';   
          }
          if(msg=='notverify'){
            window.location.href = base_url+'order/placeorder/';   
          }
          if(msg=='error'){
            window.location.reload();   
          }     
          return false; 
         
        }
      });
}
function paytimesignup_Regular(){  
  var mobileno = $('#csmobilenumber').val();
  var customername = $('#cscustomername').val();
  var email = $('#csemail').val();
  var emailRegex=/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  var token = '';
  if($('[name="csrf_digi_name"]').length){
    token = document.getElementsByName('csrf_digi_name')[0].value;
  }
  if (customername=='') { 
    Swal.fire('Please Enter your name.');         
    return false;
  }
  if (mobileno!= '' && !mobileno.match('^[0-9]+$')) { 
    Swal.fire('Please Enter valid Mobile Number only 10 digit.');         
    return false;
  }
  var mobileno_len = $("#csmobilenumber").val().length;
  if(mobileno_len>10 || mobileno_len<=9) {
    Swal.fire('Please Enter valid Mobile Number only 10 digit.');                 
    return false;
  }
  if(email==''){
    Swal.fire('Please Enter Your Valid Email Id.');                  
    return false;
  }
  if(!emailRegex.test(email)){
    Swal.fire('Please Enter Your Valid Email Id.');  
    return false;
  }

  var data = 'mobilenumber='+mobileno;
      data += '&customername='+customername;
      data += '&email='+email;
      data += '&csrf_digi_name='+token;
  $.ajax({
    type:'POST',
    url:base_url+'order/mobilenumberverify/',
    data:data,
    dataType: "json",
    success:function(result){
        var msg = result.msg;
        if(msg=='sendnotification'){
          var data = 'mobilenumber='+mobileno;
              data += '&customername='+customername;
              data += '&email='+email;
              data += '&csrf_digi_name='+token;
          $.ajax({
            type:'POST',
            url:base_url+'order/sendotp/',
            data:data,
            dataType: "json",
            success:function(result){
              var msg = result.msg;
              if(msg=='otpsendnotverify'){
                 $('#login-popup-modal').modal('hide');
                 $('#sendtonumber').html('OTP sent to '+mobileno+'');
                 $('#login-verify-popup-modal').modal('show');
              }else{
                window.location.reload();
              }      
              return false;
            }
          });
        }else{
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: result.message
            })        
            return false;
            window.location.reload();
        }      
        return false;
    }
  });
}
function viewallcoupons(){  
  var token = '';
  if($('[name="csrf_digi_name"]').length){
    token = document.getElementsByName('csrf_digi_name')[0].value;
  }  
  var data = 'csrf_digi_name='+token;
  $.ajax({
    type:'POST',
    url:base_url+'order/viewallcoupons/',
    data:data,
    dataType: "json",
    success:function(result){
      var msg = result.msg;
      //alert(msg);return false;
      if(msg=='couponfound'){
         $('#CouponCodesShow').modal('show');
         $('#couponlist').html(result.couponlist);
      }else if(msg=='couponnotfound'){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Coupon Not Found'
        }) 
      }else{
        window.location.reload();
      }      
      return false;
    }
  });
}
function couponscodevefiry(){ 
  var token = '';
  if($('[name="csrf_digi_name"]').length){
    token = document.getElementsByName('csrf_digi_name')[0].value;
  }  
  var couponscode = $('#couponscode').val();
  var data = 'csrf_digi_name='+token;
      data += '&couponscode='+couponscode;  
  $.ajax({
    type:'POST',
    url:base_url+'order/couponscodevefiry/',
    data:data,
    dataType: "json",
    success:function(result){
      var msg = result.msg;
      if(msg=='success'){
         applycoupons(result.couponsid);
      }else if(msg=='error'){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: result.message
        }) 
      }else{
        window.location.reload();
      }      
      return false;
    }
  });
}
function applycoupons(couponsid){ 

  var token = '';
  if($('[name="csrf_digi_name"]').length){
    token = document.getElementsByName('csrf_digi_name')[0].value;
  }  
  var data = 'csrf_digi_name='+token;
      data += '&couponsid='+couponsid;  
  $.ajax({
    type:'POST',
    url:base_url+'order/applycoupons/',
    data:data,
    dataType: "json",
    success:function(result){
      var msg = result.msg;
      if(msg=='success'){
         window.location.reload();
      }else if(msg=='error'){
        Swal.fire({
          icon: 'error',
          title: result.message,
          showConfirmButton: false,
          timer: 1500
        }) 
      }else{
        window.location.reload();
      }      
      return false;
    }
  });
}
function removecouponcode(){
  var token = '';
  if($('[name="csrf_digi_name"]').length){
    token = document.getElementsByName('csrf_digi_name')[0].value;
  }  
  var data = 'csrf_digi_name='+token;
  $.ajax({
    type:'POST',
    url:base_url+'order/removecouponcode/',
    data:data,
    dataType: "json",
    success:function(result){
      var msg = result.msg;
      if(msg=='success'){
         window.location.reload();
      }else if(msg=='error'){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: result.msg
        }) 
      }else{
        window.location.reload();
      }      
      return false;
    }
  });
}
function ManageAddressOrderTime()
{
  var deliveryarea = $('#deliveryarea').val();
  var completedddress = $('#completedddress').val();
  var pincode = $('#pincode').val();
  var addresstype = $('#addresstype').val();
  if (deliveryarea=='') { 
    Swal.fire('Please Enter Delivery Area.');         
    return false;
  }
  if (completedddress=='') { 
    Swal.fire('Please Enter Complete Adddress.');         
    return false;
  }
  if (pincode=='') { 
    Swal.fire('Please Enter Pincode.');         
    return false;
  }
//   var latitude = $('#latitude').val();
//   if (latitude=='') { 
//     Swal.fire('Please Allow Location.'); 
//     return false;
//   }
//   var longtitude = $('#longtitude').val();
//   if (longtitude=='') { 
//     Swal.fire('Please Allow Location.');  
//     return false;
//   }
  var token = '';
  if($('[name="csrf_digi_name"]').length){
    token = document.getElementsByName('csrf_digi_name')[0].value;
  }
  var addtocartform = $('#manageaddressesform').serialize();
  var passdata  = addtocartform;
      passdata += '&csrf_digi_name='+token;
    
  $("body").addClass("ajax-load");
  $.ajax({
    type:'POST',
    url:base_url+'order/manageaddressordertime/',
    data:passdata,
    dataType: "json",
    success:function(result){
      $("body").removeClass("ajax-load");
      $('#NewAddressModal').modal('hide');
      var msg = result.msg;
      if(msg=='success'){
        window.location.reload();
      }else if(msg=='error'){
        Swal.fire({
          icon: 'error',
          title: 'Something went wrong',
          showConfirmButton: false,
          timer: 1500
        })
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Something went wrong',
          showConfirmButton: false,
          timer: 1500
        })
      }      
      return false;
    }
  });
     
}
function RemoveAddressOrderTime(){
  var token = '';
  if($('[name="csrf_digi_name"]').length){
    token = document.getElementsByName('csrf_digi_name')[0].value;
  }  
  var data = 'csrf_digi_name='+token;
  $.ajax({
    type:'POST',
    url:base_url+'order/removeaddressordertime/',
    data:data,
    dataType: "json",
    success:function(result){
      var msg = result.msg;
      if(msg=='success'){
         window.location.reload();
      }else if(msg=='error'){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: result.msg
        }) 
      }else{
        window.location.reload();
      }      
      return false;
    }
  });
}
function pay(){
  var token = '';
  if($('[name="csrf_digi_name"]').length){
    token = document.getElementsByName('csrf_digi_name')[0].value;
  }  
  var data = 'csrf_digi_name='+token;
  $("body").addClass("ajax-load");
  $.ajax({
    type:'POST',
    url:base_url+'order/pay/',
    data:data,
    dataType: "json",
    success:function(result){
      $("body").removeClass("ajax-load");
      var msg = result.msg;
      if(msg=='success'){
         $('#pay-button').click();
      }else if(msg=='error'){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: result.message
        }) 
        window.location.reload();
      }else{
        window.location.reload();
      }      
      return false;
    }
  });
}
function minmax(value, min, max) 
{
    if(parseInt(value) < min || isNaN(parseInt(value))) {
      return min; 
    }else if(parseInt(value) > max) {
      return max; 
    }else{
      return value;
    } 
}

function get_item_selection_addons(itemid) {
  var data = 'itemid=' +itemid;
  
  if (itemid>0){    
    $("#adons-options-block").empty();
    $('#addons-options-modal').modal('hide');
    $("body").addClass("ajax-load");
    $.ajax({
      type:'POST',
      url:base_url+'order/get_item_selection_addons/',
      data:data,
      dataType: "json",
      success:function(result){
        $("body").removeClass("ajax-load");
        if (result.msg=='getinfo') {
          $("#adons-options-block").html(result.data);      
          $('#addons-options-modal').modal('show');
        } else {
          $("#adons-options-block").empty();
          $('#addons-options-modal').modal('hide');
        }
        return false;
      }
    });    
  }
}
function addToCartsWithAddons(itemid)
{
  var message  = "";
  var itemFrom   = 'items';
  var item_id    =itemid;
  var menu_id    = 0;
  var item_cost  = 0;
  var item_option_price=0;
  var item_option_id=0;
  var index = 0;
  var addtocartform='';

  var jainitem=$('#itemjain'+itemid+':checked').val();
  if(jainitem=='undefined'){
    var jainitem ='';
  }
  
  var modl = "#addons-options-modal";
  addtocartform = $('#addtocartform').serialize();
  item_id   = $(""+modl+" #selected_item_id").val();
  menu_id   = $(""+modl+" #selected_menu_id").val();
  item_cost   = $(""+modl+" #selected_item_price").val();
  itemFrom    = $(""+modl+" #itemFrom").val();
  var itemquantity = 1;    
  if (itemFrom!='' && item_id>0 && menu_id>0) {
    // var token = '';
    // if($('[name="csrf_test_name"]').length){
    //   token = document.getElementsByName('csrf_test_name')[0].value;
    // }
    // alert(token);
    var passdata  = addtocartform;
        passdata += "&itemid="+item_id;
        passdata += "&item_price="+item_cost;
        passdata += "&categoryid="+menu_id;
        passdata += "&itemFrom="+itemFrom;
        passdata += "&itemquantity="+itemquantity;
        passdata += '&jainitem='+jainitem;
    //alert(passdata);return false;
    $("body").addClass("ajax-load");
    $.ajax({
      type:'POST',
      url:base_url+'order/addToCartsWithAddons/',
      data:passdata,
      dataType: "json",
      success:function(result){
        $("body").removeClass("ajax-load");
        $("#adons-options-block").empty();
        $('#addons-options-modal').modal('hide');
        var msg = result.msg;
        if(msg=='cartinsert'){
          Swal.fire({
            icon: 'success',
            title: 'item successfully added to your cart',
            showConfirmButton: false,
            timer: 1500
          })
          $("#totalcartitem").html(result.ftotalitem);
        }else if(msg=='alreadyexisted'){
          Swal.fire({
            icon: 'warning',
            title: 'item already existed in Cart',
            showConfirmButton: false,
            timer: 1500
          })
        }else if(msg=='error'){
          Swal.fire({
            icon: 'error',
            title: 'Something went wrong',
            showConfirmButton: false,
            timer: 1500
          })
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Something went wrong',
            showConfirmButton: false,
            timer: 1500
          })
        }      
        return false;
      }
    });
  } else {
    window.location.reload();
  }    
}
function validateFeedbackForm() {
    var remarks=$('#remarks').val();
    if(remarks==''){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Please Enter Reviews...'
        }) 
        return false;
    }
    var atLeastOneChecked = false;
    var radiolen = $("input[type=radio]:checked").length;
    var selectItem = document.getElementById('ordered_item');
        if(selectItem.value === '')
        {
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Please Select Ordered Item.'
            }) 
            return false;
        }
        //alert(radiolen);
        $("input[type=radio]").each(function() {
            if ($(this).attr("checked") == "checked") {
                atLeastOneChecked = true;
            }
        });
        if(radiolen!=6)
        {
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'You must select atleast one from the list.'
            }) 
            return false;
        }
    
}
function SingleProductRating(itemid) {
  var data = 'itemid=' +itemid;
  
  if (itemid>0){    
    $.ajax({
      type:'POST',
      url:base_url+'order/SingleProductRating/',
      data:data,
      dataType: "json",
      success:function(result){
        if (result.msg=='success') {
          $("#SingleProductRatingPlatterName").html(result.SingleProductRatingPlatterName);
          $("#reviews-rating").html(result.reviewsrating);
          $("#reviews-list").html(result.reviewslist);
          $('#SingleProductRating').modal('show');
        } else {
          $('#SingleProductRating').modal('hide');
        }
        return false;
      }
    });    
  }
}
function SpecialInstructions() {
  var SpecialInstructions   = $("#SpecialInstructions").val();
  var data = 'SpecialInstructions='+SpecialInstructions;
  $.ajax({
    type:'POST',
    url:base_url+'order/SpecialInstructions/',
    data:data,
    dataType: "json",
    success:function(result){
      if (result.msg=='success') {
        // Swal.fire({
        //   icon: 'success',
        //   title: 'Special Instructions Successfully Applied.',
        //   showConfirmButton: false,
        //   timer: 1500
        // })
      }else{
        //$('#SingleProductRating').modal('hide');
      }
      return false;
    }
  });
}
function selectaddress() {
  var data = 'selectaddress=1';
  $.ajax({
    type:'POST',
    url:base_url+'order/selectaddress/',
    data:data,
    dataType: "json",
    success:function(result){
      if (result.msg=='success') {
      
      }
      if(result.msg=='enteraddress'){
        var rmessage = result.message;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: rmessage,
          timer: 2500
        })
      }
      if(result.msg=='error'){
        $("#SelectAddressModal").modal('show');
        return false;
      }
      return false;
    }
  });
}
function selectordertype(ordertype) {
  var data = 'ordertype='+ordertype;
  $.ajax({
    type:'POST',
    url:base_url+'order/selectordertype/',
    data:data,
    dataType: "json",
    success:function(result){
      // if (result.msg=='success') {
      //   $(".ordertype").hide();
      //   $("#ordertype"+ordertype).show();
      // }
      // if(result.msg=='error'){
      //   var rmessage = result.message;
      //   Swal.fire({
      //     icon: 'error',
      //     title: 'Oops...',
      //     text: rmessage,
      //     timer: 2500
      //   })
      // }
      window.location.reload();
      return false;
    }
  });
}


function get_order_status_from_fudx(order_no,order_id) {
  var data = 'order_no=' +order_no;
      data += '&order_id=' +order_id;      
  if (order_no!=''){    
    $.ajax({
      type:'POST',
      url:base_url+'order/get_order_status_from_fudx/',
      data:data,
      dataType: "json",
      success:function(result){
        var message= result.message;
        if(message=='success'){
            var ordermessageicon= base_image+'ordermessageicon/'+result.orderstatusicon;
            $("#ordermessageicon").attr("src",ordermessageicon);
            $("#orderstatustag").html(result.orderstatustag); 
            $("#orderstatusmessage").html(result.orderstatusmessage); 
            $("#orderstatusdescription").html(result.orderstatusdescription); 
            $("#orderstatusbtn").html(result.orderstatusbtn); 
            if(result.orderstatus=='Dispatch'){
                $("#mapscript").html(result.orderstatusmap); 
            }
            if(result.orderstatus=='Delivered'){
                window.location.reload();
            }
        }else{
          //window.location.reload();
        }
        return false;
      }
    });    
  }
}
function get_order_status_from_petpooja(order_no,order_id) {
  var data = 'order_no=' +order_no;
      data += '&order_id=' +order_id;      
  if (order_no!=''){    
    $.ajax({
      type:'POST',
      url:base_url+'order/get_order_status_from_petpooja/',
      data:data,
      dataType: "json",
      success:function(result){
        var message= result.message;
        if(message=='success'){
            var ordermessageicon= base_image+'ordermessageicon/'+result.orderstatusicon;
            $("#ordermessageicon").attr("src",ordermessageicon);
            $("#orderstatustag").html(result.orderstatustag); 
            $("#orderstatusmessage").html(result.orderstatusmessage); 
            $("#orderstatusdescription").html(result.orderstatusdescription); 
            $("#orderstatusbtn").html(result.orderstatusbtn); 
        }else{
          //window.location.reload();
        }
        return false;
      }
    });    
  }
}
// FilterApply
function FilterApply(page){
    if(page=='Menu'){
      var categoryid=$('#categoryid').val();
      if($('input[name="Filter"]:checked').length === 0) {
           alert('Please select one option');
      }
      var Filter = $("input[name='Filter']:checked").val();
      if(Filter==''){
          Swal.fire({
            icon: 'error',
            title: 'Please Select Filter.',
            showConfirmButton: false,
            timer: 1500
          })
          return false;
      }
      if(categoryid==''){
          Swal.fire({
            icon: 'error',
            title: 'Please Select Category.',
            showConfirmButton: false,
            timer: 1500
          })
          return false;
      }
      var data = 'Filter='+Filter;
          data += '&categoryid='+categoryid;
      
      $.ajax({
        type:'POST',
        url:base_url+'item/GetCategoryWiseItem/',
        data:data,
        dataType: "json",
        success:function(result){
          //console.log(result);
          //return false;
          var msg = result.msg;
          if(msg=='success'){
              $('#FilterModal').modal('hide'); 
              $('#CategoryWiseItemDetailsShow').html(result.response);
              return false;
          }else{
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: result.message
              })      
              return false;
          }   
          return false;
        }
      });   
    }
    if(page=='Home'){
    if($('input[name="Filter"]:checked').length === 0) {
         alert('Please select one option');
    }
    var Filter = $("input[name='Filter']:checked").val();
    if(Filter==''){
        Swal.fire({
          icon: 'error',
          title: 'Please Select Filter.',
          showConfirmButton: false,
          timer: 1500
        })
        return false;
    }
    var CategoryIds = new Array();
    $("input[name='Categoryid']:checked").each(function() {
        CategoryIds.push($(this).val());
    });
    var data = 'Filter='+Filter;
        data += '&CategoryIds='+CategoryIds;
    
    $.ajax({
      type:'POST',
      url:base_url+'item/GetFilterWiseItem/',
      data:data,
      dataType: "json",
      success:function(result){
        //console.log(result);
        //return false;
        var msg = result.msg;
        if(msg=='success'){
            $('#FilterModal').modal('hide'); 
            //$('#FilterItemShowModal').modal('show');             
            $('#FilterItemShow').html(result.response);
            var target = $('#FilterItemShow');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
            return false;
        }else{
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: result.message
            })      
            return false;
        }   
        return false;
      }
    });
  }
}

