import Foundation
import AVFoundation
import AppKit
import CoreVideo
let args=CommandLine.arguments
let folder=URL(fileURLWithPath:args[1]);let output=URL(fileURLWithPath:args[2])
let w=1600,h=1080,fps:Int32=10,seconds=8,scenes=12
try? FileManager.default.removeItem(at:output)
let writer=try AVAssetWriter(outputURL:output,fileType:.mp4)
let input=AVAssetWriterInput(mediaType:.video,outputSettings:[AVVideoCodecKey:AVVideoCodecType.h264,AVVideoWidthKey:w,AVVideoHeightKey:h,AVVideoCompressionPropertiesKey:[AVVideoAverageBitRateKey:1200000,AVVideoMaxKeyFrameIntervalKey:80]])
input.expectsMediaDataInRealTime=false
let adapter=AVAssetWriterInputPixelBufferAdaptor(assetWriterInput:input,sourcePixelBufferAttributes:[kCVPixelBufferPixelFormatTypeKey as String:kCVPixelFormatType_32ARGB,kCVPixelBufferWidthKey as String:w,kCVPixelBufferHeightKey as String:h])
writer.add(input);writer.startWriting();writer.startSession(atSourceTime:.zero)
var frame:Int64=0
for scene in 0..<scenes{
 let image=NSImage(contentsOf:folder.appendingPathComponent(String(format:"%02d.png",scene)))!
 var rect=CGRect(x:0,y:0,width:w,height:h);let cg=image.cgImage(forProposedRect:&rect,context:nil,hints:nil)!
 var maybe:CVPixelBuffer?;CVPixelBufferCreate(kCFAllocatorDefault,w,h,kCVPixelFormatType_32ARGB,nil,&maybe);let buffer=maybe!
 CVPixelBufferLockBaseAddress(buffer,[])
 let ctx=CGContext(data:CVPixelBufferGetBaseAddress(buffer),width:w,height:h,bitsPerComponent:8,bytesPerRow:CVPixelBufferGetBytesPerRow(buffer),space:CGColorSpaceCreateDeviceRGB(),bitmapInfo:CGImageAlphaInfo.noneSkipFirst.rawValue)!
 ctx.draw(cg,in:CGRect(x:0,y:0,width:w,height:h));CVPixelBufferUnlockBaseAddress(buffer,[])
 for _ in 0..<(seconds*Int(fps)){
  while !input.isReadyForMoreMediaData{Thread.sleep(forTimeInterval:0.005)}
  if !adapter.append(buffer,withPresentationTime:CMTime(value:frame,timescale:fps)){fatalError("append: \(String(describing:writer.error))")};frame+=1
 }
 print("Scene \(scene+1)/\(scenes)")
}
input.markAsFinished();let sem=DispatchSemaphore(value:0);writer.finishWriting{sem.signal()};sem.wait()
if writer.status != .completed{fatalError("encode: \(String(describing:writer.error))")}
let asset=AVURLAsset(url:output);print("Saved: \(output.path); duration \(CMTimeGetSeconds(asset.duration)) sec")
