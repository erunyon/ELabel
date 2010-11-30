/*
 * ELabel.js - v3.0 - 11/29/2010
 * https://github.com/erunyon/ELabel
 * 
 * Copyright (c) 2010 Erik Runyon
 * Dual licensed under the MIT and GPL licenses.
 * http://weedygarden.net
 */

function ELabel(point, html, classname, pixelOffset, percentOpacity, overlap) {
  // Mandatory parameters
  this.point = point;
  this.html = html;
  
  // Optional parameters
  this.classname = classname || "";
  this.pixelOffset = pixelOffset || new google.maps.Size(0,0);
  if (percentOpacity) {
    if(percentOpacity<0){percentOpacity=0;}
    if(percentOpacity>100){percentOpacity=100;}
  }        
  this.percentOpacity = percentOpacity;
  this.overlap=overlap||false;
  this.hidden = false;
} 

ELabel.prototype = new google.maps.OverlayView;

ELabel.prototype.onAdd = function(map) {
  var div = document.createElement("div");
  div.style.position = "absolute";
  div.innerHTML = '<div class="' + this.classname + '">' + this.html + '</div>' ;
	this.getPanes().floatShadow.appendChild(div);
  this.map_ = map;
  this.div_ = div;
  if (this.percentOpacity) {        
    if(typeof(div.style.filter)=='string'){div.style.filter='alpha(opacity:'+this.percentOpacity+')';}
    if(typeof(div.style.KHTMLOpacity)=='string'){div.style.KHTMLOpacity=this.percentOpacity/100;}
    if(typeof(div.style.MozOpacity)=='string'){div.style.MozOpacity=this.percentOpacity/100;}
    if(typeof(div.style.opacity)=='string'){div.style.opacity=this.percentOpacity/100;}
  }
  if (this.overlap) {
		// This is a work in progress
    // var z = GOverlay.getZIndex(this.point.lat());
    // this.div_.style.zIndex = z;
    var z = 1000*(90-this.point.lat());
    this.div_.style.zIndex = parseInt(z);
  }
  if (this.hidden) {
    this.hide();
  }
};

ELabel.prototype.onRemove = function() {
  this.div_.parentNode.removeChild(this.div_);
};

ELabel.prototype.copy = function() {
  return new ELabel(this.point, this.html, this.classname, this.pixelOffset, this.percentOpacity, this.overlap);
};

ELabel.prototype.draw = function() {
  var proj = this.getProjection(),
  		pos = proj.fromLatLngToDivPixel(this.point);

  this.div_.style.left = (pos.x + this.pixelOffset.width) + "px";
  this.div_.style.top = (pos.y +this.pixelOffset.height) + "px";
};

ELabel.prototype.show = function() {
  if (this.div_) {
    this.div_.style.display="";
    this.draw();
  }
  this.hidden = false;
};

ELabel.prototype.hide = function() {
  if (this.div_) {
    this.div_.style.display="none";
  }
  this.hidden = true;
};

ELabel.prototype.isHidden = function() {
  return this.hidden;
};

ELabel.prototype.supportsHide = function() {
  return true;
};

ELabel.prototype.setContents = function(html) {
  this.html = html;
  this.div_.innerHTML = '<div class="' + this.classname + '">' + this.html + '</div>' ;
  this.draw();
};

ELabel.prototype.setPoint = function(point) {
  this.point = point;
  if (this.overlap) {
    var z = GOverlay.getZIndex(this.point.lat());
    this.div_.style.zIndex = z;
  }
  this.draw();
};

ELabel.prototype.setOpacity = function(percentOpacity) {
  if (percentOpacity) {
    if(percentOpacity<0){percentOpacity=0;}
    if(percentOpacity>100){percentOpacity=100;}
  }        
  this.percentOpacity = percentOpacity;
  if (this.percentOpacity) {        
    if(typeof(this.div_.style.filter)=='string'){this.div_.style.filter='alpha(opacity:'+this.percentOpacity+')';}
    if(typeof(this.div_.style.KHTMLOpacity)=='string'){this.div_.style.KHTMLOpacity=this.percentOpacity/100;}
    if(typeof(this.div_.style.MozOpacity)=='string'){this.div_.style.MozOpacity=this.percentOpacity/100;}
    if(typeof(this.div_.style.opacity)=='string'){this.div_.style.opacity=this.percentOpacity/100;}
  }
};

ELabel.prototype.getPoint = function() {
  return this.point;
};