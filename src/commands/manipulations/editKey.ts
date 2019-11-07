import { window } from 'vscode'
import { LocaleTreeView } from '../../views/LocalesTreeView'
import { Config, Global } from '../../core'
import i18n from '../../i18n'
import { decorateLocale, Log } from '../../utils'
import { CommandOptions, getNode, getRecordFromNode } from './common'

export async function EditKey (item?: LocaleTreeView | CommandOptions) {
  let node = getNode(item)

  if (!node)
    return

  if (node.type === 'tree')
    return

  if (node.type === 'node') {
    const record = await getRecordFromNode(node, Config.displayLanguage)
    if (!record)
      return
    node = record
  }

  try {
    const newvalue = await window.showInputBox({
      value: node.value,
      prompt: i18n.t('prompt.edit_key_in_locale', node.keypath, decorateLocale(node.locale)),
    })

    if (newvalue !== undefined && newvalue !== node.value) {
      await Global.loader.writeToFile({ // TODO:sfc
        value: newvalue,
        keypath: node.keypath,
        filepath: node.filepath,
        locale: node.locale,
      })
    }
  }
  catch (err) {
    Log.error(err.toString())
  }
}