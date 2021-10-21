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

import org.json.JSONArray;
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
            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inPreferredConfig = Bitmap.Config.ARGB_8888;

            Bitmap bitmap = Bitmap.createScaledBitmap(BitmapFactory.decodeFile(filePath,options), width, height, false);
            if (bitmap == null) {
                promise.reject("Failed to decode. Path is incorrect or image is corrupted");
                return;
            }

            if(yaxis < bitmap.getHeight() && xaxis < bitmap.getWidth()) {
                boolean hasAlpha = bitmap.hasAlpha();
                Log.d("dddd", "xaxis" + xaxis);
                Log.d("dddd", "xaxis" + yaxis);

                int color = bitmap.getPixel((int) xaxis, (int) yaxis);
                String hex = Integer.toHexString(color);

                result.putInt("width", width);
                result.putInt("height", height);
                result.putBoolean("hasAlpha", hasAlpha);
                result.putString("pixels", hex.substring(2, 8));

                promise.resolve(result);
            }

        } catch (Exception e) {
            promise.reject(e);
        }

    }


    @ReactMethod
    public void getPrimaryColorPixelsList(String filePath,int width, int height,final Promise promise) {
        try {
            Log.d("dddd","dddd"+filePath);
            WritableNativeArray array = new WritableNativeArray();

            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inPreferredConfig = Bitmap.Config.ARGB_8888;

            Bitmap bitmap = Bitmap.createScaledBitmap(BitmapFactory.decodeFile(filePath,options), width, height, false);
            if (bitmap == null) {
                promise.reject("Failed to decode. Path is incorrect or image is corrupted");
                return;
            }

            for (int x = 0; x < bitmap.getWidth(); x++) {
                for (int y = 0; y < bitmap.getHeight(); y++) {
                    WritableNativeMap result = new WritableNativeMap();
                    int pixelLength = bitmap.getPixel(x, y);
                    Log.d("dfsafasdfas","sdfsadfasd");
                    result.putInt("x", x);
                    result.putInt("y", y);
                    result.putInt("pixels", pixelLength);
                    array.pushMap(result);
                }
            }
            promise.resolve(array);
        } catch (Exception e) {
            promise.reject(e);
        }

    }


    @ReactMethod
    public void getPrimaryColorPixels(String filePath,int width, int height,double pressx,double pressy,final Promise promise) {
        WritableArray color = Arguments.createArray();
//       Bitmap bitmap = BitmapFactory.decodeFile(filePath);
//        BitmapFactory.Options options = new BitmapFactory.Options();
//        options.inPreferredConfig = Bitmap.Config.ARGB_8888;
        BitmapFactory.Options options = new BitmapFactory.Options();
        options.inPreferredConfig = Bitmap.Config.ARGB_8888;

        Bitmap bitmap = Bitmap.createScaledBitmap(BitmapFactory.decodeFile(filePath,options), width, height, false);
        Log.d("text","xyaxis Value First"+  pressx +pressy );
        Palette.from(bitmap).generate(new Palette.PaletteAsyncListener() {
            @Override
            public void onGenerated(Palette palette) {
                try {
                    List<Palette.Swatch> swatchList = palette.getSwatches();
                    for (int i=0 ;i < swatchList.size();i++) {
                        if(i<5){
                        Palette.Swatch swatch = swatchList.get(i);
                        if (swatch != null) {
                            int rgb = swatch.getRgb();
                            int r = Color.red(rgb);
                            int g = Color.green(rgb);
                            int b = Color.blue(rgb);
                            int pixel_color_first = Color.rgb(r, g, b);

                           for (int x = 0; x < width; x++) {
                            for (int y = 0; y < height; y++) {
                                    int pixel = bitmap.getPixel(x,y);
                                    //Reading colors
                                    int redValue = Color.red(pixel);
                                    int blueValue = Color.blue(pixel);
                                    int greenValue = Color.green(pixel);
                                    int pixel_color = Color.rgb(redValue,greenValue, blueValue );
                                    if (pixel_color_first == pixel_color) {
                                        Log.d("text","xyaxis Value First"+  x +y);
                                        Log.d("text","xyaxis Value"+ String.format("%s,%s", x, y));
                                       // pixels_matching_color.add(String.format("%s,%s", x, y));
                                        break;
                                    }
                                }
                            }

                            // add 1 value for alpha factor
                            color.pushString(String.format("#%02x%02x%02x", r, g, b));


//                            for (int x = 0; x < bitmap.getWidth(); x++) {
//                                for (int y = 0; y < bitmap.getHeight(); y++) {
//                                    int primaryList = bitmap.getPixel(x, y);
//                                    String hex = Integer.toHexString(primaryList);
//                                    int redlist = (primaryList >> 16) & 0xFF;
//                                    int greenlist = (primaryList >> 8) & 0xFF;
//                                    int bluelist = primaryList & 0xFF;
//                                    // Log.d("text","message"+String.format("#%02x%02x%02x", redlist, greenlist, bluelist)+"color"+String.format("#%02x%02x%02x", r, g, b));
//                                    if(String.format("#%02x%02x%02x", redlist, greenlist, bluelist) == String.format("#%02x%02x%02x", r, g, b)){
//                                        Log.d("text"," "+x +y);
//                                    }
//                                }
//                            }




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

