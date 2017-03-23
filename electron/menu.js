const {shell} = require('electron')

exports.createMenu = function (openProjectFn) {
  return [
    {
      label: 'API designer',
      submenu: [
        {
          label: 'About API designer',
          selector: 'orderFrontStandardAboutPanel:'
        }, {
          type: 'separator'
        }, {
          label: 'Hide API designer',
          accelerator: 'Command+H',
          selector: 'hide:'
        }, {
          label: 'Quit',
          accelerator: 'Command+Q',
          selector: 'terminate:'
        }
      ]
    },
    {
      label: 'File',
      submenu: [
        {
          label: 'Open...',
          click () {
            openProjectFn()
          }
        },
        {
          label: 'Close',
          role: 'close'
        }
      ]
    },
    // {
    //   label: 'Edit',
    //   submenu: [
    //     {
    //       role: 'undo'
    //     },
    //     {
    //       role: 'redo'
    //     },
    //     {
    //       type: 'separator'
    //     },
    //     {
    //       role: 'cut'
    //     },
    //     {
    //       role: 'copy'
    //     },
    //     {
    //       role: 'paste'
    //     },
    //     {
    //       role: 'pasteandmatchstyle'
    //     },
    //     {
    //       role: 'delete'
    //     },
    //     {
    //       role: 'selectall'
    //     }
    //   ]
    // },
    {
      role: 'window',
      submenu: [
        {
          role: 'minimize'
        },
        {
          role: 'close'
        }
      ]
    }
  ]
}