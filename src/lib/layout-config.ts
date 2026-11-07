export const layoutConfig = {
  // Mobile Header ဖျောက်ချင်သော Page များ
  hideMobileHeaderRoutes: ["/watch", "/messages", "/channel", "/search"],
  
  // Mobile Bottom Navigation ဖျောက်ချင်သော Page များ (Search ကို ဖြုတ်လိုက်ပါပြီ)
  hideMobileBottomNavRoutes: ["/watch", "/messages/"],

  // လက်ရှိရောက်နေသော Route သည် အပေါ်ကစာရင်းထဲတွင် ပါ/မပါ စစ်ဆေးပေးမည့် Helper Function
  shouldHide: (pathname: string, routes: string[]) => {
    return routes.some((route) => pathname.startsWith(route));
  },
};