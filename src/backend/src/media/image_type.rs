// use js_sys::{Promise, Uint8Array};
// use web_sys::Blob;
// use web_sys::{BlobPropertyBag, File, Url};

pub struct Image {
    pub name: String,
    pub format: String,
    pub data: Vec<u8>,
}

// fn decode_image(image: &Vec<u8>) -> Option<String> {
//     let uint8arr = js_sys::Uint8Array::new(&unsafe { js_sys::Uint8Array::view(&image) }.into());
//     let array = js_sys::Array::new();
//     array.push(&uint8arr.buffer());
//     let blob = Blob::new_with_u8_array_sequence_and_options(
//         &array,
//         // web_sys::BlobPropertyBag::new().type_("application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
//         web_sys::BlobPropertyBag::new().type_("image/png"),
//     )
//         .ok()?;
//
//     let url: String = Url::create_object_url_with_blob(&blob).ok()?;
//     Some(url)
// }

// impl Image {
    // pub async fn new(file: File) -> Self {
    //     let name: String = file.name();
    //     let name = name.as_str();
    //     let v: Vec<&str> = name.split('.').collect();
    //     let name = v.get(0).unwrap().to_string();
    //     let format = v.get(1).unwrap().to_string();
    //
    //     let buffer: Promise = file.array_buffer();
    //     let result = wasm_bindgen_futures::JsFuture::from(buffer).await;
    //     let bytes: Vec<u8> = Uint8Array::new(&result.unwrap()).to_vec();
    //     Self {
    //         name,
    //         format,
    //         data: bytes,
    //     }
    // }

    // pub fn get_opt_link(image: Option<Vec<u8>>) -> Option<String> {
    //     match image {
    //         Some(image) => decode_image(&image),
    //         None => None,
    //     }
    // }

    // pub fn get_link(self: &Self) -> Option<String> {
    //     decode_image(&self.data)
    // }
// }
