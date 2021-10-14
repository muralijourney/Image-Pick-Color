package com.imagecolorpick;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.os.Environment;
import android.util.Log;
import androidx.palette.graphics.Palette;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.util.List;

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
            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inPreferredConfig = Bitmap.Config.ARGB_8888;

            Bitmap bitmap = Bitmap.createScaledBitmap(BitmapFactory.decodeFile(filePath,options), width, height, false);
            if (bitmap == null) {
                promise.reject("Failed to decode. Path is incorrect or image is corrupted");
                return;
            }

            boolean hasAlpha = bitmap.hasAlpha();

            int color = bitmap.getPixel((int)xaxis, (int)yaxis);
            String hex = Integer.toHexString(color);

            result.putInt("width", width);
            result.putInt("height", height);
            result.putBoolean("hasAlpha", hasAlpha);
            result.putString("pixels", hex.substring(2,8));

            promise.resolve(result);

        } catch (Exception e) {
            promise.reject(e);
        }

    }


    @ReactMethod
    public void getPrimaryColorPixels(String filePath,final Promise promise) {
        Bitmap bitmap = BitmapFactory.decodeFile(filePath);
        Palette.from(bitmap).generate(new Palette.PaletteAsyncListener() {
            @Override
            public void onGenerated(Palette palette) {
                try {
                    WritableArray color = Arguments.createArray();
                    List<Palette.Swatch> swatchList = palette.getSwatches();
                    for (int i=0 ;i < swatchList.size();i++) {
                        if(i<5){
                        Palette.Swatch swatch = swatchList.get(i);
                        if (swatch != null) {
                            int rgb = swatch.getRgb();
                            int r = Color.red(rgb);
                            int g = Color.green(rgb);
                            int b = Color.blue(rgb);
                            // add 1 value for alpha factor
                            color.pushString(String.format("#%02x%02x%02x", r, g, b));
                        }
                        }
                    }
                    promise.resolve(color);
                } catch (Exception e) {
                    promise.reject("No color", e);
                }
            }
        });


    }
}

