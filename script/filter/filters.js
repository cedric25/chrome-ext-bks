'use strict';

angular.module('BksManager.filters', [])

  .filter('bookmarksFilter', [function() {
    return function(tableBookmarks, selectedParents) {
      if (selectedParents.parent3 !== "") {
        return _.filter(tableBookmarks, function(bookmark) {
          return bookmark.parentId === selectedParents.parent3;
        });
      }
      else if (selectedParents.parent2 !== "") {
        return _.filter(tableBookmarks, function(bookmark) {
          return bookmark.parentId === selectedParents.parent2;
        });
      }
      else if (selectedParents.parent1 !== "") {
        return _.filter(tableBookmarks, function(bookmark) {
          return bookmark.parentId === selectedParents.parent1;
        });
      }
      return tableBookmarks;
    };
  }])

  .filter('groupsLvl2Filter', [function() {
    return function(tableGroups, selectedParents) {
      if (selectedParents.parent1 !== "") {
        return _.filter(tableGroups, function(group) {
          return group.parentId === selectedParents.parent1;
        });
      }
      return tableGroups;
    };
  }])

  .filter('groupsLvl3Filter', [function() {
    return function(tableGroups, selectedParents) {
      if (selectedParents.parent2 !== "") {
        return _.filter(tableGroups, function(group) {
          return group.parentId === selectedParents.parent2;
        });
      }
      return tableGroups;
    };
  }]);