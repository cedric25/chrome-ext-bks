/**
 * Classe 'Bookmark'
 * @param id
 * @param title
 * @param url
 * @param parentId
 */
var Bookmark = function(id, title, url, parentId) {
  this.id = id;
  this.title = title;
  this.url = url;
  this.parentId = parentId;
};