(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['cart'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                    <div class=\"col-6\">\n                        "
    + alias4(((helper = (helper = helpers.size || (depth0 != null ? depth0.size : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"size","hash":{},"data":data}) : helper)))
    + " "
    + alias4(((helper = (helper = helpers.dough || (depth0 != null ? depth0.dough : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"dough","hash":{},"data":data}) : helper)))
    + " Pizza\n                    </div>\n                    <div class=\"col-4\">\n                        <h5>Toppings</h5>\n                        <ul>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.toppings : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + "                        </ul>\n                    </div>\n                    <div class=\"col-2\">\n                        Price: "
    + alias4(((helper = (helper = helpers.price || (depth0 != null ? depth0.price : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"price","hash":{},"data":data}) : helper)))
    + "$\n                    </div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "                                <li>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</li>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "                                No Toppings\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "                    <h6 class=\"col-6\">No Pizzas</h6>\n";
},"8":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                    <div class=\"col-6\">\n                        "
    + alias4(((helper = (helper = helpers.pasta || (depth0 != null ? depth0.pasta : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pasta","hash":{},"data":data}) : helper)))
    + "\n                    </div>\n                    <div class=\"col-2 offset-4\">\n                        Price: "
    + alias4(((helper = (helper = helpers.price || (depth0 != null ? depth0.price : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"price","hash":{},"data":data}) : helper)))
    + "$\n                    </div>\n";
},"10":function(container,depth0,helpers,partials,data) {
    return "                    <h6 class=\"col-6\">No Pastas</h6>\n";
},"12":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                    <div class=\"col-6\">\n                        "
    + alias4(((helper = (helper = helpers.salad || (depth0 != null ? depth0.salad : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"salad","hash":{},"data":data}) : helper)))
    + "\n                    </div>\n                    <div class=\"col-2 offset-4\">\n                        Price: "
    + alias4(((helper = (helper = helpers.price || (depth0 != null ? depth0.price : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"price","hash":{},"data":data}) : helper)))
    + "$\n                    </div>\n";
},"14":function(container,depth0,helpers,partials,data) {
    return "                    <h6 class=\"col-6\">No Salads</h6>\n";
},"16":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                    <div class=\"col-6\">\n                        "
    + alias4(((helper = (helper = helpers.size || (depth0 != null ? depth0.size : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"size","hash":{},"data":data}) : helper)))
    + " "
    + alias4(((helper = (helper = helpers.sub || (depth0 != null ? depth0.sub : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"sub","hash":{},"data":data}) : helper)))
    + " Sub\n                    </div>\n                    <div class=\"col-4\">\n                        <h5>Extras</h5>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.extras : depth0),{"name":"each","hash":{},"fn":container.program(17, data, 0),"inverse":container.program(19, data, 0),"data":data})) != null ? stack1 : "")
    + "                    </div>\n                    <div class=\"col-2\">\n                        Price: "
    + alias4(((helper = (helper = helpers.price || (depth0 != null ? depth0.price : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"price","hash":{},"data":data}) : helper)))
    + "$\n                    </div>\n";
},"17":function(container,depth0,helpers,partials,data) {
    return "                            <ul>\n                                <li>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</li>\n                            </ul>\n";
},"19":function(container,depth0,helpers,partials,data) {
    return "                            No Extras\n";
},"21":function(container,depth0,helpers,partials,data) {
    return "                    <h6 class=\"col-6\">No Subs</h6>\n";
},"23":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                    <div class=\"col-6\">\n                        "
    + alias4(((helper = (helper = helpers.size || (depth0 != null ? depth0.size : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"size","hash":{},"data":data}) : helper)))
    + " "
    + alias4(((helper = (helper = helpers.platter || (depth0 != null ? depth0.platter : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"platter","hash":{},"data":data}) : helper)))
    + " Platter\n                    </div>\n                    <div class=\"offset-4 col-2\">\n                        Price: "
    + alias4(((helper = (helper = helpers.price || (depth0 != null ? depth0.price : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"price","hash":{},"data":data}) : helper)))
    + "$\n                    </div>\n";
},"25":function(container,depth0,helpers,partials,data) {
    return "                    <h6 class=\"col-6\">No Platters</h6>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\"container border border-primary rounded fixed-top\" id='cart'>\n    <div class=\"row\">\n        <div class=\"col-4\">\n            <h5>Shopping Cart</h5>\n        </div>\n        <div class=\"offset-4 col-4\">\n            <div class=\"btn btn-outline-primary\" id=\"back-to-shopping\">\n                Back To Shopping\n            </div>\n        </div>\n    </div>\n    <div class=\"row\" id=\"pizza-row\">\n        <div class=\"container\">\n            <div class=\"row\">\n                <h5 class=\"col-4\">Pizzas:</h5>\n            </div>\n            <div class=\"row\" id=\"pizza-container\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.pizzas : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(6, data, 0),"data":data})) != null ? stack1 : "")
    + "            </div>\n        </div>\n    </div>\n    <div class=\"row\" id=\"pasta-row\">\n        <div class=\"container\">\n            <div class=\"row\">\n                <h5 class=\"col-4\">Pastas:</h5>\n            </div>\n            <div class=\"row\" id=\"pasta-container\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.pastas : depth0),{"name":"each","hash":{},"fn":container.program(8, data, 0),"inverse":container.program(10, data, 0),"data":data})) != null ? stack1 : "")
    + "            </div>\n        </div>\n    </div>\n    <div class=\"row\" id=\"salads-row\">\n        <div class=\"container\">\n            <div class=\"row\">\n                <h5 class=\"col-4\">Salads:</h5>\n            </div>\n            <div class=\"row\" id=\"salad-container\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.salads : depth0),{"name":"each","hash":{},"fn":container.program(12, data, 0),"inverse":container.program(14, data, 0),"data":data})) != null ? stack1 : "")
    + "            </div>\n        </div>\n    </div>\n    <div class=\"row\" id=\"subs-row\">\n        <div class=\"container\">\n            <div class=\"row\">\n                <h5 class=\"col-4\">Subs:</h5>\n            </div>\n            <div class=\"row\" id=\"sub-container\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.subs : depth0),{"name":"each","hash":{},"fn":container.program(16, data, 0),"inverse":container.program(21, data, 0),"data":data})) != null ? stack1 : "")
    + "            </div>\n        </div>\n    </div>\n    <div class=\"row\" id=\"platters-row\">\n        <div class=\"container\">\n            <div class=\"row\">\n                <h5 class=\"col-4\">Platters:</h5>\n            </div>\n            <div class=\"row\" id=\"platter-container\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.platters : depth0),{"name":"each","hash":{},"fn":container.program(23, data, 0),"inverse":container.program(25, data, 0),"data":data})) != null ? stack1 : "")
    + "            </div>\n        </div>\n    </div>\n    <div class=\"row\">\n        <div class=\"offset-8 col-4\" id=\"total\">\n            <h6>Total: "
    + container.escapeExpression(((helper = (helper = helpers.total || (depth0 != null ? depth0.total : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"total","hash":{},"data":data}) : helper)))
    + "$</h6>\n            <div class=\"btn btn-primary\">\n                Place an order\n            </div>\n        </div>\n    </div>\n</div>\n";
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