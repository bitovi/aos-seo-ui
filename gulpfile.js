/**
 * @page platform/gulp Gulp
 * @parent platform
 * @group platform/gulp/tasks 0 Tasks
 * @group platform/gulp/config 1 Configuration
 *
 * ## Gulp Structure
 *
 * Rather than manage one giant `gulpfile.js`, each task is broken out into its own file in the `gulp/tasks` directory. Any files in that directory get automatically required in the `gulpfile.js`.
 *
 * Configuration for the tasks is in `gulp/config.js`.
 *
 * ### Adding a New Task
 * To add a new task, simply add a new task file that directory. `gulp/tasks/default.js` specifies the default set of tasks to run when you run `gulp`.
 */

var requireDir = require('require-dir');

// Require all tasks in gulp/tasks, including subfolders
requireDir('./gulp/tasks', { recurse: true });
