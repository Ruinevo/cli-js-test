window.beforeAfter = (function () {
  const apps = document.querySelectorAll('[data-script="before-after"]')

  apps.forEach(item => {
    const { scriptAfter, scriptBefore } = item.dataset

    new Vue({
      el: item,
      template: `
      <div class="cli-comparer">
        <div class="cli-compare-after">
          <img class="" :src="after" alt="slide2">
        </div>
  
        <div class="cli-compare-before" :style="{width: left + '%'}">
          <img class="" :src="before" alt="slide2">
        </div>
  
        <div class="cli-comparer-runner" :style="{left: left + '%'}">
          <div class="cli-comparer-handle">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="cli-comparer-handle" role="presentation" class="left">
              <title id="cli-comparer-handle" lang="en">cli-comparer-handle icon</title>
              <g fill="currentColor">
                <path data-v-229c6e1a="" d="M5.15137 12.0001L8.57563 8.57581L9.42416 9.42433L6.84842 12.0001L9.42416 14.5758L8.57563 15.4243L5.15137 12.0001ZM18.8483 12.0001L15.4241 8.57581L14.5755 9.42433L17.1513 12.0001L14.5755 14.5758L15.4241 15.4243L18.8483 12.0001Z">
              </path>
              </g>
            </svg>
          </div>
        </div>
  
        <input v-model="left" type="range" min="0" max="100" />
      </div>
    `,
      data: {
        left: 50,
        before: scriptBefore,
        after: scriptAfter
      },
    })
  })
})()


