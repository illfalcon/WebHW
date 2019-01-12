(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['cart'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"container border border-primary rounded fixed-top\" id='cart'>\n    <div class=\"row\">\n        <div class=\"col-4\">\n            <h5>Shopping Cart</h5>\n        </div>\n        <div class=\"offset-4 col-4\">\n            <div class=\"btn btn-primary\">\n                Back To Shopping\n            </div>\n        </div>\n    </div>\n    <div class=\"row\" id=\"pizza-row\">\n        <h5>Pizzas:</h5>\n    </div>\n    <div class=\"row\" id=\"pasta-row\">\n        <h5>Pastas:</h5>\n    </div>\n    <div class=\"row\" id=\"salads-row\">\n        <h5>Salads:</h5>\n    </div>\n    <div class=\"row\" id=\"subs-row\">\n        <h5>Subs:</h5>\n    </div>\n    <div class=\"row\" id=\"platters-row\">\n        <h5>Platters:</h5>\n    </div>\n    <div class=\"row\">\n        <div class=\"offset-8 col-4\" id=\"total\">\n            Total:\n        </div>\n    </div>\n</div>\n";
},"useData":true});
templates['checkBoxButton'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<button class=\"btn btn-secondary\" type=\"button\" name=\""
    + alias4(((helper = (helper = helpers.model || (depth0 != null ? depth0.model : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"model","hash":{},"data":data}) : helper)))
    + "\" id=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "-extra\" autocomplete=\"off\" value=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</button>\n";
},"useData":true});
templates['pizzaButton'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<label class=\"btn btn-secondary\">\n    <input type=\"radio\" name=\""
    + alias4(((helper = (helper = helpers.model || (depth0 != null ? depth0.model : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"model","hash":{},"data":data}) : helper)))
    + "\" id=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" autocomplete=\"off\" value=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\"> "
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\n</label>\n";
},"useData":true});
templates['toppingSelectionTemplate'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.escapeExpression;

  return "    <option value=\""
    + alias1(((helper = (helper = helpers.pk || (depth0 != null ? depth0.pk : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pk","hash":{},"data":data}) : helper)))
    + "\">"
    + alias1(container.lambda(((stack1 = (depth0 != null ? depth0.fields : depth0)) != null ? stack1.name : stack1), depth0))
    + "</option>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<select class=\"form-control\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.options : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</select>\n";
},"useData":true});
})();