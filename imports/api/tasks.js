import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';


export const Tasks = new Mongo.Collection('tasks');

Meteor.methods({
  'tasks.insert'(text) {
    check(text, String);
 
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 
    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
  },
  'tasks.remove'(taskId) {

  	var task_user = Tasks.findOne({_id : taskId}).username;
  	if (! Meteor.userId() || Meteor.userId() !== task_user) {
      throw new Meteor.Error('not-authorized');
    }

    check(taskId, String);
 
    Tasks.remove(taskId);
  },
  'tasks.setChecked'(taskId, setChecked) {
  	var task_user = Tasks.findOne({_id : taskId}).username;
  	if (! Meteor.userId() || Meteor.userId() !== task_user) {
      throw new Meteor.Error('not-authorized');
    }

    check(taskId, String);
    check(setChecked, Boolean);
 
    Tasks.update(taskId, { $set: { checked: setChecked } });
  },
});