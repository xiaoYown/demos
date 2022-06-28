extern crate wasm_bindgen;

// use std::mem::ManuallyDrop;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn fibonacci(n: i32) -> i32 {
    match n {
        0 => 1,
        1 => 1,
        _other => fibonacci(n - 1) + fibonacci(n - 2),
    }
}

// #[wasm_bindgen]
// struct Size {
//     width: f64,
//     height: f64,
// }

// #[wasm_bindgen]
// impl Size {
//     pub fn new(width: f64, height: f64) -> Size {
//         Size { width, height }
//     }

//     pub fn get(&self) -> Size {
//         Size {
//             width: self.width,
//             height: self.height,
//         }
//     }
// }

#[wasm_bindgen]
pub fn cal_size_zoom(sizes: Vec<f64>, zoom: f64) -> Vec<f64> {
    let mut result: Vec<f64> = Vec::new();

    for item in sizes {
        result.push(item * zoom * zoom)
    }
    return result;
}

// #[wasm_bindgen]
// pub fn calSizeZoom(sizes: Vec<Size>, zoom: f64) -> Vec<Size> {
//     let mut result: Vec<Size> = Vec::new();

//     for item in sizes {
//         result.push(Size {
//             width: item.width * &zoom,
//             height: item.height * &zoom,
//         })
//     }
//     return result;
// }

// #[export_name = "calSizeZoom"]
// pub extern "C" fn __wasm_bindgen_generated_cal(arg0: Vec<Size>, arg1: f64) {
//     let arg0 = unsafe {
//         ManuallyDrop::new(JsValue::__from_idx(arg0))
//     };
//     let arg0 = &*arg0;
//     calSizeZoom(arg0, arg1);
// }
