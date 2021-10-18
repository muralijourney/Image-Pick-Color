//
//  ImageColorPick.m
//  ImageColorPick
//
//  Created by A, Muralitharan on 16/10/21.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "ImageColorPick.h"
#import <AssetsLibrary/AssetsLibrary.h>


@implementation ImageColorPick:NSObject

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(getPrimaryColorPixels:(NSString *)path callback:(RCTResponseSenderBlock)callback)
{
  UIImage *image = [UIImage imageWithContentsOfFile:path];
  CGImageRef cgImage = image.CGImage;

  NSUInteger width = CGImageGetWidth(cgImage);
  NSUInteger height = CGImageGetHeight(cgImage);
  NSLog(@"%lu",(unsigned long)width);
  NSLog(@"%lu",(unsigned long)height);

  CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
  unsigned char *rawData = (unsigned char*) calloc(height * width * 4, sizeof(unsigned char));

  NSUInteger bytesPerPixel = 4;
  NSUInteger bytesPerRow = bytesPerPixel * width;
  NSUInteger bitsPerComponent = 8;

  
  CGContextRef context = CGBitmapContextCreate(rawData, width, height,
                  bitsPerComponent, bytesPerRow, colorSpace,
                  kCGImageAlphaPremultipliedLast | kCGBitmapByteOrder32Big);

  CGColorSpaceRelease(colorSpace);
  
  CGContextDrawImage(context, CGRectMake(0, 0, width, height), cgImage);
  CGContextRelease(context);

  NSMutableArray *result = [NSMutableArray array];
  
  // Now your rawData contains the image data in the RGBA8888 pixel format.
  for (int x = 0 ; x < width ; ++x)
  {
    for (int y = 0 ; y < height ; ++y)
    {
      
      NSUInteger byteIndex = (bytesPerRow * y) + x * bytesPerPixel;
      CGFloat alpha = ((CGFloat) rawData[byteIndex + 3] ) / 255.0f;
      CGFloat red   = ((CGFloat) rawData[byteIndex]     ) / alpha;
      CGFloat green = ((CGFloat) rawData[byteIndex + 1] ) / alpha;
      CGFloat blue  = ((CGFloat) rawData[byteIndex + 2] ) / alpha;
      byteIndex += bytesPerPixel;
      
      // nan
      NSString *hexString=[NSString stringWithFormat:@"%02X%02X%02X", (int)(red * 255), (int)(green * 255), (int)(blue * 255)];
      [result addObject:hexString];
    }

  }

  NSMutableArray* pickedNames = [NSMutableArray new];
  int remaining = 5;
  if (result.count >= remaining) {
      while (remaining > 0) {
        int randomNumber = (int)0 + arc4random() % (result.count-0+1);
        NSString *name = result[randomNumber];
        NSString *nameColor = [name substringWithRange:NSMakeRange(0, 6)];
        NSMutableString *mu = [NSMutableString stringWithString:nameColor];
        [mu insertString:@"#" atIndex:0];
        if (![pickedNames containsObject:mu]) {
          [pickedNames addObject:mu];
          remaining--;
        }
      }
  }
  NSLog(@"NSString = %@", [pickedNames class]);
  NSLog(@"pickedNames:: %@", pickedNames);
  free(rawData);

  callback(@[[NSNull null], pickedNames]);

}


RCT_EXPORT_METHOD(getPixels:(NSString *)path width:(NSUInteger *)width
                  height:(NSUInteger *)height x:(NSUInteger *)x y:(NSUInteger *)y callback:(RCTResponseSenderBlock)callback)
{
  
  
  UIImage *image = [UIImage imageWithContentsOfFile:path];
  // CGImageRef cgImage = image.CGImage;
  
  [image drawInRect:CGRectMake(0, 0,(NSUInteger)width,(NSUInteger)height)];
  UIImage *newImage = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  CGImageRef cgImage = newImage.CGImage;

  
  NSUInteger width1 = CGImageGetWidth(cgImage);
  NSUInteger height1 = CGImageGetHeight(cgImage);
  
  CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
  unsigned char *rawData = (unsigned char*) calloc((NSUInteger)height1 * (NSUInteger)width1 * 4, sizeof(unsigned char));

  NSUInteger bytesPerPixel = 4;
  NSUInteger bytesPerRow = (NSUInteger)bytesPerPixel * (NSUInteger)width1;
  NSUInteger bitsPerComponent = 8;


  CGContextRef context = CGBitmapContextCreate(rawData, (NSUInteger)width1, (NSUInteger)height1,
                  bitsPerComponent, bytesPerRow, colorSpace,
                  kCGImageAlphaPremultipliedLast | kCGBitmapByteOrder32Big);

  CGColorSpaceRelease(colorSpace);

  CGContextDrawImage(context, CGRectMake(0, 0, (NSUInteger)width1, (NSUInteger)height1), cgImage);
  CGContextRelease(context);


  // Now your rawData contains the image data in the RGBA8888 pixel format.

  NSUInteger byteIndex = (bytesPerRow * (NSUInteger)y) + (NSUInteger)x * bytesPerPixel;
  CGFloat alpha = ((CGFloat) rawData[byteIndex + 3] ) / 255.0f;
  CGFloat red   = ((CGFloat) rawData[byteIndex]     ) / alpha;
  CGFloat green = ((CGFloat) rawData[byteIndex + 1] ) / alpha;
  CGFloat blue  = ((CGFloat) rawData[byteIndex + 2] ) / alpha;
  byteIndex += bytesPerPixel;

      // nan
  NSString *hexString=[NSString stringWithFormat:@"#%02x%02x%02x", (int)(red * 255), (int)(green * 255), (int)(blue * 255)];
  NSLog(@"%@",hexString);
  NSString *nameColor = [hexString substringWithRange:NSMakeRange(2, 6)];
  NSLog(@"%@",nameColor);
  NSMutableString *mu = [NSMutableString stringWithString:nameColor];
  [mu insertString:@"#" atIndex:0];
  NSLog(@"%@",mu);
  free(rawData);

  callback(@[[NSNull null], mu]);

}
@end

