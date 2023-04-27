import * as ImagePicker from 'expo-image-picker'
import { array } from 'prop-types'



export const loadImageFromGallery = async(array) => {
    const response  = { status: false, image: null}
    const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: array
    })
    if(result.canceled){
        return response
    }
    response.status = true
    response.image = result.assets
    return response
}