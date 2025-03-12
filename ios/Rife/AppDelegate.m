#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import <FBSDKCoreKit/FBSDKCoreKit-swift.h>
//#import <React/RCTPushNotificationManager.h>
#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>
#include <AudioToolbox/AudioToolbox.h>
#import <React/RCTLinkingManager.h>
#import <Firebase.h>
// @import Firebase;
//#import "RNFirebaseNotifications.h"
//#import "RNFirebaseMessaging.h"
//#include <FBAudienceNetwork/FBAdSettings.h>


#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>

static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
#ifdef FB_SONARKIT_ENABLED
  InitializeFlipper(application);
#endif

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"Rife"
                                            initialProperties:nil];

  if (@available(iOS 13.0, *)) {
      rootView.backgroundColor = [UIColor systemBackgroundColor];
  } else {
      rootView.backgroundColor = [UIColor whiteColor];
  }

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;
  
  [FIRApp configure];
//  [RNFirebaseNotifications configure];
  [[FBSDKApplicationDelegate sharedInstance] application:application
  didFinishLaunchingWithOptions:launchOptions];
  
  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
      
  //  for (NSString *familyName in [UIFont familyNames]){
  //    NSLog(@"Family name: %@", familyName);
  //    for (NSString *fontName in [UIFont fontNamesForFamilyName:familyName]) {
  //      NSLog(@"--Font name: %@", fontName);
  //    }
  //  }

  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
  UIApplicationState state = [[UIApplication sharedApplication] applicationState];
  if (state == UIApplicationStateBackground || state == UIApplicationStateInactive) {
    //[UIApplication sharedApplication].applicationIconBadgeNumber = [badge intValue];
    AudioServicesPlaySystemSound(1007);
  } else if (state == UIApplicationStateActive) {
    AudioServicesPlaySystemSound(1007);
  }
  [RNCPushNotificationIOS didRegisterUserNotificationSettings:notificationSettings];
//  [[RNFirebaseMessaging instance] didRegisterUserNotificationSettings:notificationSettings];
  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  UIApplicationState state = [[UIApplication sharedApplication] applicationState];
  if (state == UIApplicationStateBackground || state == UIApplicationStateInactive) {
    //[UIApplication sharedApplication].applicationIconBadgeNumber = [badge intValue];
    AudioServicesPlaySystemSound(1007);
  } else if (state == UIApplicationStateActive) {
    AudioServicesPlaySystemSound(1007);
  }
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
//  [[RNFirebaseNotifications instance] didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
{
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo];
  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
}

- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
  UIApplicationState state = [[UIApplication sharedApplication] applicationState];
  if (state == UIApplicationStateBackground || state == UIApplicationStateInactive) {
    //[UIApplication sharedApplication].applicationIconBadgeNumber = [badge intValue];
    AudioServicesPlaySystemSound(1007);
  } else if (state == UIApplicationStateActive) {
    AudioServicesPlaySystemSound(1007);
  }
  [RNCPushNotificationIOS didReceiveLocalNotification:notification];
//  [[RNFirebaseNotifications instance] didReceiveLocalNotification:notification];
  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *) options
{
  if ([[url scheme] isEqualToString:@"Resonize"] == YES)
  {
    return [RCTLinkingManager application:application openURL:url options:options];
  }
   if ([[url scheme] isEqualToString:@"Rife"] == YES)
  {
    return [RCTLinkingManager application:application openURL:url options:options];
  }
  if ([[url scheme] isEqualToString:@"RIFE"] == YES)
  {
    return [RCTLinkingManager application:application openURL:url options:options];
  }
  if ([[url scheme] isEqualToString:@"fb913201526417881"] == YES)
  {
    BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:application openURL:url sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey] annotation:options[UIApplicationOpenURLOptionsAnnotationKey]];
    return handled;
  }
  return NO;
}

//Called when a notification is delivered to a foreground app.
-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  UIApplicationState state = [[UIApplication sharedApplication] applicationState];
  if (state == UIApplicationStateBackground || state == UIApplicationStateInactive) {
    //[UIApplication sharedApplication].applicationIconBadgeNumber = [badge intValue];
    AudioServicesPlaySystemSound(1007);
  } else if (state == UIApplicationStateActive) {
    AudioServicesPlaySystemSound(1007);
  }
  completionHandler(UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge);
}

@end
