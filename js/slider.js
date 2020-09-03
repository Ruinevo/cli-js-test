if (!Object.fromEntries) {
  Object.defineProperty(Object, 'fromEntries', {
    value(entries) {
      if (!entries || !entries[Symbol.iterator]) { throw new Error('Object.fromEntries() requires a single iterable argument'); }

      const o = {};

      Object.keys(entries).forEach((key) => {
        const [k, v] = entries[key];

        o[k] = v;
      });

      return o;
    },
  });
}


const stringToObject = (str) => {
  const obj = new URLSearchParams(str);
  const a = Object.fromEntries([...obj])
  const trueObject = {}
  Object.keys(a).forEach(key => {
    try {
      trueObject[key] = JSON.parse(a[key])
    } catch {
      trueObject[key] = a[key]
    }
    
  })
  return trueObject
}


const apps = document.querySelectorAll('[data-script="slider"]')



apps.forEach(item => {
  
  const dataset = Object.assign({}, item.dataset)

  const icon = dataset.navIcon

  const settings = {}

  for (let i in dataset) {
    if (i.startsWith('point')) {
      const key = i.split('-')[1]
      const value = stringToObject(dataset[i])
      value.navText = [icon, icon]
      settings[key] = value
    }
  }

  console.log(settings);

  Vue.use(VueOwlCarousel)

  const comp = Vue.component('test', {
    template: '<div>123</div>'
  })

  new Vue({
    el: item,
    components: {
      comp
    },
    template: `<div><vue-owl-carousel class="${item.className}" :responsive="settings">${item.innerHTML}</vue-owl-carousel><comp/></div>`,
    data: {
      settings
    }
  })
})


