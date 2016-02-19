//////////////////////////////////////
///////////GLOBAL VARIABLES//////////
////////////////////////////////////

var waitForIt; //delay on mouse scoll over timer variable
var waitToHoverLink; //delay on mouse scroll over comments link
var hamburgerIMG = chrome.extension.getURL("img/ham.png"); //Menu icon location || may need to rework this when put on the store
var hoverOpenIMG = chrome.extension.getURL("img/hovertoopen.gif"); //hover instructions image || mayneed rework
var dblClickToCloseIMG = chrome.extension.getURL("img/dblclicktoclose.gif"); //dblclick to close instruct image
var changeSettingsIMG = chrome.extension.getURL("img/changesettings.gif");
var isMenuOptionsVisible = 0; //is the menu options (now known as settings) open
var theCommentLink; //the variable that sets comment links to green when you have that one open
var shouldWindowStayOpen = 0; // the variable that keeps track if the user wants to keep the hover window open
var _AnalyticsCode = 'UA-72168956-1';
localStorage.isRedditResizeOn;
localStorage.isNightModeOn;
localStorage.isImageHoverOn;
localStorage.isThisYourFirstTime;

//////////////////////////////////////
/////////WHEN DOCUMENT LOADS/////////
////////////////////////////////////

$(function(){
  start();
});

//////////////////////////////////////
////////INITIALIZE FUNCTION//////////
////////////////////////////////////

function start(){
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);

  $('body').on('mouseenter', '.comments', hoverComments);
  $('body').on('mouseleave', '.comments', cancelCommentsHover);
  $('body').on('click', '.menu', menuIsClicked);
  $('body').on('dblclick', removeComments);
  $('body').on('click', '.onoffswitch-checkbox', setLocalStorageResize);
  $('body').on('click', '.darkmode-checkbox', setLocalStorageNight);
  $('body').on('click', '.linkhover-checkbox', setLocalStorageLinkHover);
  $('body').on('click', '.exitbtnalienhover', removeComments);
  $('body').on('click', '.hoverimghereexit', removeHoverWindow);

  isThisTheFirstTime();
  ifWindowResize();
};

//////////////////////////////////////
//////////////FUNCTIONS//////////////
////////////////////////////////////

function isThisTheFirstTime(){
  var iUnderstandBtn = 0;
  if(localStorage.isThisYourFirstTime == undefined){
    $('body').append('<div class="firsttimeholder"></div>');
    $('body').append('<div class="firsttimeinfobox"><span class="hellofirsttimer">Hi! Alien Hover noticed this is your first time using this app!</span><br><span class="contentstuff">Before you start, there is a couple things you should know.<p><br><p class="firststepinstruct">1.) <span style="color:green;">Hover</span> over a reddit comment\'s link to open it in the same page. <span style="color:red;">Do not click!</span><br><img src="" class="hoveropenishere"/></p></p><p class="dblclicksteppara"><br>2.) <span style="color:green;">Double click</span> anywhere empty on the website to close the comments window.<br><img src="" class="dblclickishere"></p></p><p class="findsettinginstruct">3.) <span style="color: green;">Click Settings</span> to adjust the options of Alien Hover.<img class="settingsishere" src=""/></p><button class="igotitbtn">I understand!</button></div>');
    $('.hoveropenishere').attr('src', hoverOpenIMG);
    $('.dblclickishere').attr('src', dblClickToCloseIMG);
    $('.settingsishere').attr('src', changeSettingsIMG);
    $('.dblclicksteppara').hide();
    $('.findsettinginstruct').hide();
    $('.igotitbtn').on('click', function(){
      if(iUnderstandBtn == 0){
        $('.firststepinstruct').hide();
        $('.dblclicksteppara').show();
      }
      if(iUnderstandBtn == 1){
        $('.dblclicksteppara').hide();
        $('.findsettinginstruct').show();
      }
      if(iUnderstandBtn == 2){
        $('.firsttimeholder').remove();
        $('.firsttimeinfobox').remove();
        localStorage.isThisYourFirstTime = 1;
      }
      iUnderstandBtn++;
    });
  }
}

function removeComments(){
  if($('.commentwindow').length > 0){

    $('.commentwindow').animate({'margin-right': '-=45%'}, {complete: function(){$('.commentwindow').remove();}});
    theCommentLink.css('color', '#888');
    $('.comments').css('color', '#888');

      if(localStorage.isRedditResizeOn == 1){
        resizeRedditWhenCommentsLeave();
      }else{
        $('.content').css('width', '99%');
      }
  };
  $('.side').show();
  $('.side').css('position', 'relative');
  $('.side').css('z-index', '500');
};

function hoverComments(){
  var theUrl = $(this).attr('href');
  theCommentLink = $(this);

  waitForIt = setTimeout(function(){
      $.ajax({
        url: theUrl,
        success: function(response){
          if($('.commentwindow').length == 0){
              theCommentLink.css('color', 'green');

            $('body').append('<div class="commentwindow"></div>');

            $('.commentwindow').prepend('<div class="menu"><img class="hamburgerimg" src=""/><div class="menutitle">settings</div></div>');
            $('.hamburgerimg').attr('src', hamburgerIMG);
            $('.commentwindow').append('<div class="commentstitlealienhover"></div>');
            $('.commentwindow').append('<div class="exitbtnalienhover">X</div>');
            var theT = $(response).find('a.title').text();
            var theC = $(response).find('.commentarea');
            $('.commentstitlealienhover').text(theT);
            $('.commentwindow').append(theC);
            checkBeforeOptionsExist();

            $('.commentwindow').animate({'margin-right': '+=45%'})
          }
          if($('.commentwindow').length == 1){
            $('.themenuoptions').hide();
            theCommentLink.css('color', 'green');

            $('.commentarea').remove();
            theCommentLink.css('color', 'green');
            var theT = $(response).find('a.title').text();
            var theC = $(response).find('.commentarea');
            $('.commentstitlealienhover').text(theT);
            $('.commentwindow').append(theC);
            checkBeforeOptionsExist();
          }
        },
        error: function(){
          console.log('error');
        }
      });
  }, 280);


};

function cancelCommentsHover(){
  clearInterval(waitForIt);
};

///////////////////////////////////////////////////
function ifWindowResize(){
  $(window).resize(function() {
    var resizeCommentArea = window.innerHeight - 65;
    var windowWidth = window.innerWidth;

    //Resize comment area height
    $('.commentarea').css('height', resizeCommentArea);

    if(windowWidth < 500){
      $('.menutitle').hide();
      $('.menu').css('text-align', 'center');
      $('.commentarea').css('width', '100%');
      $('.commentarea').css('overflow-x', 'scroll');
    }else{
      $('.menutitle').show();
      $('.menu').css('text-align', 'left');
    }
  });
};
///////////////////////////////////////////////////


////////////////////BAD CODING//////////////////////
function menuIsClicked(){
  if(isMenuOptionsVisible > 0){
    $('.themenuoptions').remove();
    $('.commentarea').show();
    $('.commentstitlealienhover').show();
    $('.menutitle').text('settings');
    $('.hamburgerimg').removeClass('menuisopenhamicon');
    isMenuOptionsVisible--;
  }else{
    $('.commentarea').hide();
    $('.commentstitlealienhover').hide();
    createMenuContent();
    checkIfButtonsOn();
  }
};

function createMenuContent(){
  $('.menutitle').text('comments');
  $('.hamburgerimg').addClass('menuisopenhamicon');

  //<p><b><i>Double click the mouse anywhere to close this window.</i></b></p><br>

  var menuDiv = '<div class="themenuoptions"><p>Reddit resize: <div class="onoffswitch"><input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch" checked><label class="onoffswitch-label" for="myonoffswitch"></label></div>This option allows you to resize the reddit window so you can scrolling and viewing content when the comments window is open.  (It is recommended.)</p><br><p>Night mode: <div class="darkmodeswitch"><input type="checkbox" name="darkmode" class="darkmode-checkbox" id="darkmode"><label class="darkmode-label" for="darkmode"></label></div>Night mode is a feature that allows you to match the style of Reddit Enhancement Suites night mode.  So the comments window doesn\'t look out of place if you use that theme.</p><br><p>Link Hover Mode: <div class="linkhoverswitch"><input type="checkbox" name="linkhover" class="linkhover-checkbox" id="linkhover" checked><label class="linkhover-label" for="linkhover"></label></div>The link hover allows you to preview links inside of the comments window when you hover over them. To keep a window open press h while hovering. (This feature has a lot of bugs at the moment so if it is not working well turn it off.)</p><br><p>Created by DigitalCold</p><br></p><div class="donateplaceholder"><form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top"><input type="hidden" name="cmd" value="_s-xclick"><input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----"><input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!"><img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1"></form></div></div>';

  $('.commentwindow').append(menuDiv);
  isMenuOptionsVisible++;
};

function checkIfButtonsOn(){
  if(localStorage.isRedditResizeOn == 1){
    $('.onoffswitch-checkbox').prop('checked', true);
    resizeRedditWhenCommentsEnter();
  }else{
    $('.onoffswitch-checkbox').prop('checked', false);
  }
  if(localStorage.isNightModeOn == 1){
    $('.darkmode-checkbox').prop('checked', true);
    darkModeEngage();
  }else{
    $('.darkmode-checkbox').prop('checked', false);
  }
  if(localStorage.isImageHoverOn == 1){
    $('.linkhover-checkbox').prop('checked', true);
    $('body').on('mouseenter', '.commentarea .usertext-body a', cImageHover);
    $('body').on('mouseleave', '.commentarea .usertext-body a', cImageHoverLeave);
    $('body').on('mouseleave', '.commentarea .usertext-body a', cancelLinkHover);
  }else{
    $('.linkhover-checkbox').prop('checked', false);
  }
};

function checkBeforeOptionsExist(){
  if(localStorage.isRedditResizeOn == 1){
    resizeRedditWhenCommentsEnter();
  }else{
    $('.content').css('width', '99%');
  }
  if(localStorage.isNightModeOn == 1){
    darkModeEngage();
  }
  if(localStorage.isImageHoverOn == 1){
    $('body').on('mouseenter', '.commentarea .usertext-body a', cImageHover);
    $('body').on('mouseleave', '.commentarea .usertext-body a', cImageHoverLeave);
    $('body').on('mouseleave', '.commentarea .usertext-body a', cancelLinkHover);
  }else{
    $('body').off('mouseenter', '.commentarea .usertext-body a', cImageHover);
    $('body').off('mouseleave', '.commentarea .usertext-body a', cImageHoverLeave);
    $('body').off('mouseleave', '.commentarea .usertext-body a', cancelLinkHover);
  }
};

function setLocalStorageResize(){
  if(localStorage.isRedditResizeOn == 1){
    localStorage.isRedditResizeOn = 0;
  }else{
    localStorage.isRedditResizeOn = 1;
  }
};

function setLocalStorageNight(){
  if(localStorage.isNightModeOn == 1){
    localStorage.isNightModeOn = 0;
    revertDarkMode();
  }else{
    localStorage.isNightModeOn = 1;
    darkModeEngage();
  }
};

function setLocalStorageLinkHover(){
  if(localStorage.isImageHoverOn == 1){
    localStorage.isImageHoverOn = 0;
    $('body').off('mouseenter', '.commentarea .usertext-body a', cImageHover);
    $('body').off('mouseleave', '.commentarea .usertext-body a', cImageHoverLeave);
    $('body').off('mouseleave', '.commentarea .usertext-body a', cancelLinkHover);
  }else{
    localStorage.isImageHoverOn = 1;
    $('body').on('mouseenter', '.commentarea .usertext-body a', cImageHover);
    $('body').on('mouseleave', '.commentarea .usertext-body a', cImageHoverLeave);
    $('body').on('mouseleave', '.commentarea .usertext-body a', cancelLinkHover);
  }
};

function resizeRedditWhenCommentsEnter(){
  $('.content').css('width', '60%');
};

function resizeRedditWhenCommentsLeave(){
  $('.content').css('width', '99%');
};

function darkModeEngage(){
  $('.menu').css('background', '#999999');
  $('.commentwindow').css('background', '#161616');
  $('.commentwindow').css('color', 'white');
};

function revertDarkMode(){
  $('.menu').css('background', '#CEE3F8');
  $('.commentwindow').css('background', 'white');
  $('.commentwindow').css('color', 'black');
}
////////////////////////////////////////////////////




///////////////////////////////////////////////////
function cImageHover(){
  // add s to http://
  var theUrl;
  var grabUrl = $(this).attr('href');


  waitToHoverLink = setTimeout(function(){
    //if substrig = httpimgur or httpsimgur and end is not .gifv add .gifv

    if(grabUrl.substring(0,5) == 'https'){
      if($('.hoverimghere').length == 0){
        theUrl = grabUrl;
        $('body').append('<div class="hoverimghere"></div>');
        $('.hoverimghere').append('<div class="hoverimghereexit">X</div>');
        $('.hoverimghere').append('<iframe src="'+theUrl+'" style="border:none;" class="hoveriframe"></iframe>');
      }
    } else {
      if($('.hoverimghere').length == 0){
        var httpstr = grabUrl.substring(0,4);
        var sstr = "s";
        var thereststr = grabUrl.substring(4, grabUrl.length);
        theUrl = httpstr + sstr + thereststr;
        $('body').append('<div class="hoverimghere"></div>');
        $('.hoverimghere').append('<div class="hoverimghereexit">X</div>');
        $('.hoverimghere').append('<iframe src="'+theUrl+'" style="border:none;" class="hoveriframe"></iframe>');
      }
    };
    $(document).on('keydown', function(e){
      if(e.which == 72){
        if(shouldWindowStayOpen == 0){
          shouldWindowStayOpen = 1;
        }
      }
    });
  }, 500);
};

function cancelLinkHover(){
  clearInterval(waitToHoverLink);
};

function cImageHoverLeave(){
  if(shouldWindowStayOpen == 0){
    $('.hoverimghere').remove();
  }
}

function removeHoverWindow(){
  if(shouldWindowStayOpen = 1){
    $('.hoverimghere').remove();
    shouldWindowStayOpen = 0;
  }
}
