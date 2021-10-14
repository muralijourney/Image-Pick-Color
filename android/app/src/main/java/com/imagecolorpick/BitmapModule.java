package com.imagecolorpick;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.os.Environment;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import java.io.File;
import java.io.FileInputStream;

public class BitmapModule extends ReactContextBaseJavaModule {

    public BitmapModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "ImageColorPick";
    }



    @ReactMethod
    public void getPixels(String filePath,double xaxis,double yaxis, int width, int height,final Promise promise) {
        try {
            Log.d("dddd","dddd"+filePath);

            WritableNativeMap result = new WritableNativeMap();
            WritableNativeArray pixels = new WritableNativeArray();
//            BitmapFactory.Options options = new BitmapFactory.Options();
           // options.inSampleSize = 3;

           // File f= new File(filePath);
            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inPreferredConfig = Bitmap.Config.ARGB_8888;

            // Bitmap bitmap = BitmapFactory.decodeStream(new FileInputStream(f), null, options);


            Bitmap bitmap = Bitmap.createScaledBitmap(BitmapFactory.decodeFile(filePath,options), width, height, false);
            if (bitmap == null) {
                promise.reject("Failed to decode. Path is incorrect or image is corrupted");
                return;
            }

            boolean hasAlpha = bitmap.hasAlpha();

            int color = bitmap.getPixel((int)xaxis, (int)yaxis);
            Log.d("dddd","color"+color);
            String hex = Integer.toHexString(color);
            final int red = Color.red(color);
            final int green = Color.green(color);
            final int blue = Color.blue(color);

            Log.d("dddd","red"+ red);
            Log.d("dddd","green"+ green);
            Log.d("dddd","blue"+ blue);


            // pixels.pushString(hex);

//            for (int x = 0; x < width; x++) {
//                for (int y = 0; y < height; y++) {
//                    int color1 = bitmap.getPixel(x, y);
//                    String hex1 = Integer.toHexString(color1);
//                    pixels.pushString(hex);
//                }
//            }
//

            result.putInt("width", width);
            result.putInt("height", height);
            result.putBoolean("hasAlpha", hasAlpha);
            result.putString("pixels", hex.substring(2,8));

            promise.resolve(result);

        } catch (Exception e) {
            promise.reject(e);
        }

    }

}

