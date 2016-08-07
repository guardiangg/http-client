var tsParse = require('typescript-eslint-parser');
var fs = require('fs');
var _ = require('lodash');
var cheerio = require('cheerio');

var terms = [];
var logger = console.log;

module.exports = function(source, type) {
   terms = [];

   if (type === 'ts') {
      disableLogging();
      var parsed = tsParse.parse(source, {});
      enableLogging();

      _.each(parsed.body, function(node) {
         if (node.declaration) {
            walkTs(node.declaration);
         }
      });
   } else if (type === 'html') {
      terms = extractHtml(source);
   }

   return terms;
};

var disableLogging = function() {
   console.log = function() {};
};

var enableLogging = function() {
   console.log = logger;
};

var walkTs = function(node) {
   if (!node) {
      return;
   }

   switch(node.type) {
      case "ClassDeclaration":
      case "ArrowFunctionExpression":
         _.each(node.body.body, function(subnode) {
            walkTs(subnode);
         });
         break;

      case "MethodDefinition":
         _.each(node.value.body.body, function(subnode) {
            walkTs(subnode);
         });
         break;

      case "BlockStatement":
         _.each(node.body, function(subnode) {
            walkTs(subnode);
         });
         break;

      case "ConditionalExpression":
      case "IfStatement":
         node.consequent && walkTs(node.consequent);
         node.alternate && walkTs(node.alternate);
         break;

      case "ForInStatement":
         if (node.left) {
            _.each(node.left.declarations, function(dec) {
               walkTs(dec);
            });
         }

         if (node.body) {
            _.each(node.body.body, function(subnode) {
               walkTs(subnode);
            });
         }
         break;

      case "ExpressionStatement":
         walkTs(node.expression);
         break;

      case "VariableDeclaration":
         _.each(node.declarations, function(dec) {
            walkTs(dec);
         });
         break;

      case "VariableDeclarator":
         if (node.init) {
            walkTs(node.init);
         }
         break;

      case "AssignmentExpression":
      case "BinaryExpression":
      case "LogicalExpression":
         node.left && walkTs(node.left);
         node.right && walkTs(node.right);
         break;

      case "UnaryExpression":
         walkTs(node.argument);
         break;

      case "CallExpression":
      case "NewExpression":
         if (node.callee.type == 'FunctionExpression') {
            walkTs(node.callee.body);

         } else if (
            node.callee.property
            && node.callee.property.name === 'getString'
            && node.callee.object.name === '_gettext'
         ) {
            terms.push({
               term: node.arguments[0].value,
               start: node.loc.start
            });

         } else {
            _.each(node.arguments, function(arg) {
               walkTs(arg);
            });

         }

         break;

      case "ArrayExpression":
         _.each(node.elements, function(ele) {
            walkTs(ele);
         });
         break;

      case "ObjectExpression":
         _.each(node.properties, function(prop) {
            walkTs(prop.value);
         });
         break;

      case "MetaProperty":
         node.meta && walkTs(node.meta);
         node.property && walkTs(node.property);
         break;

      case "ContinueStatement":
      case "Identifier":
      case "Literal":
      case "MemberExpression":
      case "ReturnStatement":
         break;

      default:
         throw "Unknown node type: " + node.type;
         break;
   }
};

var extractHtml = function(src) {
   var terms = [];
   var $ = cheerio.load(src, { decodeEntities: false, withStartIndices: true });

   $('[translate]').each(function(idx, ele) {
      var term = $(ele).html();
      term = term.replace(/(\r\n|\n|\r)/gm, ' ').replace(/\s\s+/g, ' ').trim();

      terms.push({
         term: term,
         start: {
            line: '-',
            column: '-'
         }
      });
   });

   var re = new RegExp('\{\{(?:\\s*\\:\\:\\s*)?\\s*(\'|"|&quot;|&#39;)(.*?)\\1\\s*\\|\\s*translate\\s*(\}\}|\\|)', 'g');
   var matches;
   while (matches = re.exec(src)) {
      terms.push({
         term: matches[2].replace(/\\\'/g, '\''),
         start: {
            line: '-',
            column: '-'
         }
      });
   }

   return terms;
};
