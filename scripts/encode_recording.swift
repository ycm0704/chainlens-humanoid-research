import Foundation
import AVFoundation
import AppKit
import CoreVideo
let folder=URL(fileURLWithPath:CommandLine.arguments[1]),output=URL(fileURLWithPath:CommandLine.arguments[2])
let info=try JSONSerialization.jsonObject(with:Data(contentsOf:folder.appendingPathComponent("frames.json"))) as! [String:Any]
let frames=info["frames"] as! [[String:Any]],duration=info["duration"] as! Double,w=1440,h=900,fps:Int32=20
try? FileManager.default.removeItem(at:output)
let writer=try AVAssetWriter(outputURL:output,fileType:.mp4)
let input=AVAssetWriterInput(mediaType:.video,outputSettings:[AVVideoCodecKey:AVVideoCodecType.h264,AVVideoWidthKey:w,AVVideoHeightKey:h,AVVideoCompressionPropertiesKey:[AVVideoAverageBitRateKey:700000,AVVideoMaxKeyFrameIntervalKey:40]])
let adapter=AVAssetWriterInputPixelBufferAdaptor(assetWriterInput:input,sourcePixelBufferAttributes:[kCVPixelBufferPixelFormatTypeKey as String:kCVPixelFormatType_32ARGB,kCVPixelBufferWidthKey as String:w,kCVPixelBufferHeightKey as String:h])
writer.add(input);writer.startWriting();writer.startSession(atSourceTime:.zero)
var index=0,cached = -1,buffer:CVPixelBuffer?=nil
for frame in 0..<Int(ceil(duration*Double(fps))){
 let t=Double(frame)/Double(fps)
 while index+1<frames.count && (frames[index+1]["time"] as! Double)<=t{index+=1}
 if cached != index {
  let image=NSImage(contentsOf:folder.appendingPathComponent(frames[index]["file"] as! String))!
  var rect=CGRect(x:0,y:0,width:w,height:h);let cg=image.cgImage(forProposedRect:&rect,context:nil,hints:nil)!
  CVPixelBufferCreate(kCFAllocatorDefault,w,h,kCVPixelFormatType_32ARGB,nil,&buffer)
  CVPixelBufferLockBaseAddress(buffer!,[])
  let ctx=CGContext(data:CVPixelBufferGetBaseAddress(buffer!),width:w,height:h,bitsPerComponent:8,bytesPerRow:CVPixelBufferGetBytesPerRow(buffer!),space:CGColorSpaceCreateDeviceRGB(),bitmapInfo:CGImageAlphaInfo.noneSkipFirst.rawValue)!
  ctx.draw(cg,in:CGRect(x:0,y:0,width:w,height:h));CVPixelBufferUnlockBaseAddress(buffer!,[]);cached=index
 }
 while !input.isReadyForMoreMediaData{Thread.sleep(forTimeInterval:0.002)}
 if !adapter.append(buffer!,withPresentationTime:CMTime(value:Int64(frame),timescale:fps)){fatalError("append failed")}
}
input.markAsFinished();let sem=DispatchSemaphore(value:0);writer.finishWriting{sem.signal()};sem.wait()
guard writer.status == .completed else{fatalError("encode failed")}
print("Saved continuous browser recording: \(duration) seconds")
