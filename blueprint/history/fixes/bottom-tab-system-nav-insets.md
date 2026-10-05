# Fix: Bottom Tab System Navigation Insets

**Type:** Fix  
**Status:** verified  
**Branch:** fix/bottom-tab-system-nav-insets  

## The problem

On Android devices (especially those using 3-button system navigation or edge-to-edge system insets), the bottom tab bar is partially or completely covered by the Android system navigation bar (Back, Home, Recents buttons). 

In [`src/app/(tabs)/_layout.tsx`](file:///c:/Users/oreofe/Desktop/HNG/lutshop_mobile/src/app/(tabs)/_layout.tsx), the tab bar height and bottom padding are statically hardcoded (`height: 64, paddingBottom: 10` on Android) without consuming safe area bottom insets. When the Android navigation bar overlays the window, the tab labels and icons render behind the system buttons.

## The fix

1. Import `useSafeAreaInsets` from `react-native-safe-area-context` in [`src/app/(tabs)/_layout.tsx`](file:///c:/Users/oreofe/Desktop/HNG/lutshop_mobile/src/app/(tabs)/_layout.tsx).
2. Dynamically calculate the tab bar height and bottom padding based on `insets.bottom`:
   - Compute dynamic bottom padding: `insets.bottom > 0 ? insets.bottom : (Platform.OS === 'ios' ? 24 : 8)`.
   - Compute dynamic total height: `56 + insets.bottom`.
3. Ensure tab icons, active indicators, and labels sit comfortably above any system buttons or gesture indicator without adding redundant blank space on devices without navigation bars.

## Build steps

- [x] **Step 1 - Dynamic Safe Area Insets for Bottom Tab Bar** - Update [`src/app/(tabs)/_layout.tsx`](file:///c:/Users/oreofe/Desktop/HNG/lutshop_mobile/src/app/(tabs)/_layout.tsx) to integrate `useSafeAreaInsets` and apply dynamic `paddingBottom` and `height` to `tabBarStyle`. *Done when:* `npx tsc --noEmit` and `npm run lint` pass with 0 errors, and the bottom tab bar adjusts height to stay entirely above the system navigation buttons on Android.

## Verify

1. Run the app on the Android emulator or device with 3-button navigation enabled.
2. Confirm that all four tabs (Shop, Cart, Library, Account) have their icons and labels fully visible and clickable above the system navigation buttons.
3. Test on iOS or gesture navigation to ensure no excessive gap is created.


<!-- blueprint:completion {"schemaVersion":1,"specBytes":2182,"specSha256":"51945560c14df823c756894879810d7cb7ea800d523b538800c2a794330788f8","branch":"refs/heads/fix/bottom-tab-system-nav-insets","head":"3f2323a64de7970c8329c0c4d6a2a9c25e130aaa","baseRef":"refs/heads/main","baseCommit":"3f2323a64de7970c8329c0c4d6a2a9c25e130aaa","sourceTree":"1a5e79a2bc9d2db81b6839fd144fb7ceb0256e5a","absentOptional":[]} -->
