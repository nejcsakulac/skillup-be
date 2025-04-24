import * as fs from 'fs'
import { diskStorage, Options } from 'multer'
import { extname } from 'path'
import Logging from '../library/Logging'

type validFileExtensionsType = 'png' | 'jpg' | 'jpeg'
const validFileExtensions: validFileExtensionsType[] = ['png', 'jpg', 'jpeg']
const validMimeTypes: string[] = ['image/png', 'image/jpeg']

export const saveImageToStorage: Options = {
  storage: diskStorage({
    destination: './files',
    filename(req, file, callback) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      const ext = extname(file.originalname)
      const filename = `${uniqueSuffix}${ext}`
      callback(null, filename)
    },
  }),
  fileFilter(req, file, callback) {
    if (validMimeTypes.includes(file.mimetype)) {
      callback(null, true)
    } else {
      callback(null, false)
    }
  },
}

export const isFileExtensionSafe = async (fullFilePath: string): Promise<boolean> => {
  try {
    // Dynamically import ESM-only module to avoid CJS/ESM mismatch
    const { fileTypeFromFile } = await import('file-type')
    const fileInfo = await fileTypeFromFile(fullFilePath)
    if (!fileInfo) {
      return false
    }
    const { ext, mime } = fileInfo
    const isFileTypeLegit = validFileExtensions.includes(ext as validFileExtensionsType)
    const isMimeTypeLegit = validMimeTypes.includes(mime)
    return isFileTypeLegit && isMimeTypeLegit
  } catch (err) {
    Logging.error(err)
    return false
  }
}

export const removeFile = (fullFilePath: string): void => {
  try {
    fs.unlinkSync(fullFilePath)
  } catch (error) {
    Logging.log(error)
  }
}
