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
      
      NSLog(@"Color Range :: %@", hexString);

     // UIColor *acolor = [UIColor colorWithRed:red green:green blue:blue alpha:alpha];
      
    }
//      [result addObject:acolor];
  }

  
  
}


@end

