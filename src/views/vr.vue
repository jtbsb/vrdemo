<template>
  <!-- 主容器，用于渲染全景图查看器 -->
  <div class="home" id="viewer"></div>
  <FloorPlan :current-room="selectedRoom" :current-rotation="currentRotation" />
</template>

<script>
// 导入 photo-sphere-viewer 核心功能
import { Viewer, utils } from "@photo-sphere-viewer/core"
// 导入标记插件，用于添加标记点和导航点
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin"
import { MapPlugin } from "@photo-sphere-viewer/map-plugin"
import { AutorotatePlugin } from "@photo-sphere-viewer/autorotate-plugin"
import "@photo-sphere-viewer/map-plugin/index.css"
// 导入核心样式
import "@photo-sphere-viewer/core/index.css"
// 导入标记插件样式
import "@photo-sphere-viewer/markers-plugin/index.css"
// 导入全景图资源
import livingroom from "@/assets/livingroom.jpg" // 客厅全景图
import kitchen from "@/assets/kitchen.jpg" // 厨房全景图
import balcony from "@/assets/balcony.jpg" // 阳台全景图
import corridor from "@/assets/corridor.jpg" // 走廊全景图
import elderroom from "@/assets/elderroom.jpg" // 老人房全景图
import bedroom from "@/assets/bedroom.jpg" // 卧室全景图
import childroom from "@/assets/childroom.jpg" // 儿童房全景图
import shijiao from "@/assets/shijiao.png" // 儿童房全景图
import huxingtu from "@/assets/huxingtu.webp" // 儿童房全景图
import FloorPlan from "@/components/FloorPlan.vue"

// 检查是否已定义链接标记组件
if (!customElements.get("link-marker")) {
  // 定义链接标记元素类
  class LinkMarkerElement extends HTMLElement {
    constructor() {
      super()
      // 创建封闭的 Shadow DOM
      const dom = this.attachShadow({ mode: "closed" })

      // 创建样式元素
      const style = document.createElement("style")
      // 设置链接标记的样式
      style.innerText = `
:host {
    display: block;
    position: relative;
    width: auto;
    height: auto;
}

div {
    padding: 10px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    border-radius: 5px;
}
`
      // 将样式添加到 Shadow DOM
      dom.appendChild(style)

      // 创建内容容器
      const div = document.createElement("div")
      div.innerHTML = `<slot></slot>` // 使用插槽允许外部内容注入
      dom.appendChild(div)
    }
  }

  // 注册链接标记自定义元素
  customElements.define("link-marker", LinkMarkerElement)
}

// 检查是否已定义标签标记组件
if (!customElements.get("label-marker")) {
  // 定义标签标记元素类
  class LabelMarkerElement extends HTMLElement {
    constructor() {
      super()
      // 创建封闭的 Shadow DOM
      const dom = this.attachShadow({ mode: "closed" })

      // 创建样式元素
      const style = document.createElement("style")
      // 设置标签标记的样式
      style.innerText = `
:host {
    display: block;
    position: relative;
    width: 37.5px;
    height: 37.5px;
}

/* 按钮样式 */
button {
    width: 100%;
    height: 100%;
    padding: 0;
    border: none;
    background: none;
    color: white;
    border-radius: 50%;
    filter: drop-shadow(0 7.5px 3.75px rgba(0, 0, 0, 0.2));
}

/* 提示框样式 */
.tooltip {
    box-sizing: border-box;
    width: 300px;
    position: absolute;
    bottom: calc(100% + 10px);
    left: calc(50% -  150px);
    background: rgba(30, 30, 30, 0.8);
    color: white;
    text-shadow: 0 1px #000;
    border-radius: 10px;
    transform-origin: 50% calc(100% + 35px);
    transform: rotate(30deg);
    opacity: 0;
    font-size: 16px;
    padding: 10px;
    pointer-events: none;
}

/* 底部提示框样式 */
.tooltip.bottom {
    bottom: auto;
    top: calc(100% + 10px);
    transform-origin: 50% -35px;
}

/* 悬停动画效果 */
.tooltip.hovered {
    animation: rotate-bounce-out 200ms ease forwards;
}

/* 提示框内容样式 */
.tooltip slot::slotted(h2),
.tooltip slot::slotted(p) {
    margin: 1rem;
    text-align: justify;
    font-size: 16px;
}

/* 提示框箭头样式 */
.tooltip::after {
    content: '';
    width: 0px;
    height: 0px;
    color: rgba(30, 30, 30, 0.8);
    border: 10px solid transparent;
    border-top-color: currentColor;
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -10px;
}

/* 底部提示框箭头样式 */
.tooltip.bottom::after {
    border-top-color: transparent;
    border-bottom-color: currentColor;
    top: auto;
    bottom: 100%;
}

/* 按钮悬停动画 */
button:hover {
    animation: ripple 1s ease-out;
}

/* 提示框隐藏动画 */
.tooltip.hiding {
    animation: hide 200ms ease forwards;
}

/* 按钮悬停时显示提示框 */
button:hover + .tooltip {
    animation: show 300ms ease forwards;
}

/* 涟漪动画效果 */
@keyframes ripple {
    0% { box-shadow: 0 0 0 0 rgba(97, 170, 242, 0); }
    20% { box-shadow: 0 0 0 3.75px rgba(97, 170, 242, 1); }
    100% { box-shadow: 0 0 0 15px rgba(97, 170, 242, 0); }
}

/* 显示动画 */
@keyframes show {
    0% { transform: rotate(30deg); opacity: 0; }
    70% { transform: rotate(-10deg); }
    100% { transform: rotate(0deg); opacity: 1; }
}

/* 隐藏动画 */
@keyframes hide {
    0% { transform: rotate(0deg); opacity: 1; }
    100% { transform: rotate(30deg); opacity: 0; }
}
`
      // 将样式添加到 Shadow DOM
      dom.appendChild(style)

      // 创建按钮元素
      const button = document.createElement("button")
      button.innerHTML = `<svg viewBox="0 0 100 100">
        <circle cx=50 cy=50 r=18.75 fill="currentColor"/>
        <circle cx=50 cy=50 r=30 stroke-width=7.5 fill="none" stroke="currentColor"/>
      </svg>`
      dom.appendChild(button)

      // 创建提示框元素
      this.tooltip = document.createElement("div")
      this.tooltip.classList.add("tooltip")
      dom.appendChild(this.tooltip)
      this.tooltip.innerHTML = "<slot></slot>"

      // 添加鼠标离开事件监听
      button.addEventListener("mouseleave", () => {
        this.tooltip.classList.add("hiding")
      })

      // 添加动画结束事件监听
      dom.addEventListener("animationend", () => {
        this.tooltip.classList.remove("hiding")
      })
    }
  }

  // 注册标签标记自定义元素
  customElements.define("label-marker", LabelMarkerElement)
}

export default {
  name: "PhotoSphereViewer",
  components: {
    FloorPlan
  },
  // 组件数据
  data() {
    return {
      viewer: null, // 全景图查看器实例
      markersPlugin: null, // 标记插件实例
      selectedRoom: 1, // 当前选中的房间ID
      currentRotation: 0,
      // 房间配置列表
      roomList: [
        {
          name: "客厅",
          id: 1,
          image: livingroom,
          default: [0.004462416413474557, 6.200447421781119], // 默认视角 [俯仰角, 偏航角]
          // 可跳转的房间链接
          link: [
            {
              name: "厨房",
              id: 2,
              position: [0.016901838640870137, 2.824191484956904] // 标记位置 [俯仰角, 偏航角]
            },
            {
              name: "阳台",
              id: 3,
              position: [-0.09078160155478066, 6.208635699116904]
            },
            {
              name: "走廊",
              id: 4,
              position: [-0.08338922415879213, 1.4666233295481192]
            }
          ],
          // 房间内的标签点
          labelList: [
            {
              assetId: "1",
              assetName: "油画",
              position: [-0.13582816064354786, 0.41502126541757445]
            },
            {
              assetId: "2",
              assetName: "茶几",
              position: [-0.4708173515700462, 0.07097928959460549]
            },
            {
              assetId: "3",
              assetName: "沙发",
              position: [-0.3959674179007451, 5.663651604962541]
            },
            {
              assetId: "4",
              assetName: "椅子",
              position: [-0.6779325382830392, 2.324892386928859]
            },
            {
              assetId: "5",
              assetName: "花束",
              position: [-0.2900747817000602, 6.218594448123747]
            }
          ]
        },
        {
          name: "厨房",
          id: 2,
          image: kitchen,
          default: [0.09328385188665655, 0.6135062081428665],
          link: [
            {
              name: "客厅",
              id: 1,
              position: [-0.2084227785520698, 4.478063645111686]
            }
          ],
          labelList: [
            {
              assetId: "1",
              assetName: "锅具",
              position: [-0.32040309847985693, 1.2697563771195304]
            },
            {
              assetId: "2",
              assetName: "油烟机",
              position: [0.33306242221675886, 1.5793125466479674]
            }
          ]
        },
        {
          name: "阳台",
          id: 3,
          image: balcony,
          default: [0.010700120950292824, 0.1715490327792142],
          link: [
            {
              name: "客厅",
              id: 1,
              position: [-0.20909100758988974, 3.13973647274324]
            }
          ],
          labelList: [
            {
              assetId: "31",
              assetName: "绿植",
              position: [-0.23004977865286058, 1.495660967217504]
            },
            {
              assetId: "32",
              assetName: "盆栽",
              position: [-0.2594667408190994, 5.350830330601267]
            }
          ]
        },
        {
          name: "走廊",
          id: 4,
          image: corridor,
          default: [-0.022173309349004633, 5.3004805588348445],
          link: [
            {
              name: "客厅",
              id: 1,
              position: [-0.23694933108856153, 1.6637153034353807]
            },
            {
              name: "A卧室",
              id: 6,
              position: [-0.12898462142555878, 4.771346915257906]
            },
            {
              name: "B卧室",
              id: 5,
              position: [-0.16972506617993943, 3.636162534947699]
            },
            {
              name: "儿童房",
              id: 7,
              position: [-0.15258789207123757, 5.860620394323365]
            }
          ],
          labelList: [
            {
              assetId: "41",
              assetName: "灯开关",
              position: [0.05583900567831912, 1.2559256924742868]
            }
          ]
        },
        {
          name: "B卧室",
          id: 5,
          image: elderroom,
          default: [-0.060600660705094844, 4.28014837364676],
          link: [
            {
              name: "走廊",
              id: 4,
              position: [-0.06382695401593685, 2.4312968468519767]
            }
          ],
          labelList: [
            {
              assetId: "51",
              assetName: "灯开关",
              position: [0.025656577672767522, 3.096746567162901]
            },
            {
              assetId: "52",
              assetName: "床",
              position: [-0.40524988992018596, 4.575652180649995]
            },
            {
              assetId: "53",
              assetName: "壁画",
              position: [0.0981070449597663, 4.338252119723118]
            }
          ]
        },
        {
          name: "A卧室",
          id: 6,
          image: bedroom,
          default: [-0.37202430179471135, 0.7883401345123922],
          link: [
            {
              name: "走廊",
              id: 4,
              position: [-0.08569721802629693, 3.125521320871638]
            }
          ],
          labelList: [
            {
              assetId: "61",
              assetName: "灯开关",
              position: [-0.0016850013269975594, 3.232396589929455]
            },
            {
              assetId: "62",
              assetName: "床",
              position: [-0.37202430179471135, 0.7883401345123922]
            },
            {
              assetId: "63",
              assetName: "床头柜",
              position: [-0.3061632949425557, 1.2358397614158223]
            }
          ]
        },
        {
          name: "儿童房",
          id: 7,
          image: childroom,
          default: [-0.08715790946130575, 4.482227088077283],
          link: [
            {
              name: "走廊",
              id: 4,
              position: [-0.06382695401593685, 2.4312968468519767]
            }
          ],
          labelList: [
            {
              assetId: "71",
              assetName: "灯开关",
              position: [0.016933996172134425, 2.7674989692129213]
            },
            {
              assetId: "72",
              assetName: "读物",
              position: [-0.5928811354836303, 5.1803141454412005]
            },
            {
              assetId: "73",
              assetName: "床",
              position: [-0.537420512703882, 4.000039357027511]
            },
            {
              assetId: "74",
              assetName: "衣柜",
              position: [-0.053631294847794386, 3.2411977796609963]
            }
          ]
        }
      ]
    }
  },
  // 组件挂载时初始化
  mounted() {
    this.initViewer(this.getRoomById(this.selectedRoom).image)
    // 添加视角变化监听
    this.viewer.addEventListener("position-updated", () => {
      const position = this.viewer.getPosition()
      if (position && typeof position.yaw === "number") {
        // 将弧度转换为角度，并确保角度在0-360之间
        let degrees = ((position.yaw * 180) / Math.PI) % 360
        // 调整角度范围并反转方向
        this.currentRotation = degrees < 0 ? 360 + degrees : degrees
      }
    })
  },
  methods: {
    // 根据ID获取房间配置
    getRoomById(id) {
      return this.roomList.find((room) => room.id === id)
    },
    // 初始化全景图查看器
    initViewer(panorama) {
      // 如果已存在查看器实例，先销毁
      if (this.viewer) {
        this.viewer.destroy()
      }

      const room = this.getRoomById(this.selectedRoom)

      // 创建新的查看器实例
      this.viewer = new Viewer({
        container: "viewer",
        panorama: panorama,
        caption: "",
        defaultZoomLvl: 50,
        maxFov: 90,
        minFov: 30,
        mousemove: true,
        mousewheel: true,
        navbar: false,
        fisheye: 0,
        defaultYaw: room.default[1], // 设置默认偏航角
        plugins: [
          [
            MarkersPlugin,
            {
              markers: []
            }
          ], // 标记
          // [
          //   MapPlugin,
          //   {
          //     imageUrl: huxingtu,
          //     center: { x: 785, y: 421 },
          //     rotation: "-12deg"
          //   }
          // ], // 地图
          [
            AutorotatePlugin,
            {
              autorotatePitch: "5deg"
            }
          ] // 自转
        ]
      })

      // 获取标记插件实例
      this.markersPlugin = this.viewer.getPlugin(MarkersPlugin)

      // 查看器准备就绪后更新标记
      this.viewer.addEventListener(
        "ready",
        () => {
          this.updateMarkers()
        },
        { once: true }
      )

      // 添加点击事件监听器，用于调试位置
      this.viewer.addEventListener("click", (e) => {
        console.log(e.data.pitch + ", " + e.data.yaw)
      })

      // 初始化当前旋转角度
      this.currentRotation = ((room.default[1] * 180) / Math.PI) % 360
    },
    // 切换全景图
    changePanorama() {
      const currentRoom = this.getRoomById(this.selectedRoom)

      // 执行向前缩放动画
      new utils.Animation({
        properties: {
          zoom: { start: this.viewer.getZoomLevel(), end: 110 },
          fisheye: { start: 0, end: 1 }
        },
        duration: 1000,
        easing: "inQuad",
        onTick: (properties) => {
          this.viewer.zoom(properties.zoom)
          this.viewer.setOption("fisheye", properties.fisheye)
        }
      }).then(() => {
        // 在动画结束时切换全景图
        this.viewer
          .setPanorama(currentRoom.image, {
            transition: false,
            showLoader: false
          })
          .then(() => {
            // 设置新房间的初始视角
            this.viewer.rotate({
              yaw: currentRoom.default[1],
              pitch: currentRoom.default[0],
              transition: false
            })

            // 执行缩小动画
            new utils.Animation({
              properties: {
                zoom: { start: 110, end: 50 },
                fisheye: { start: 0, end: 0 }
              },
              duration: 600,
              easing: "outQuad",
              onTick: (properties) => {
                this.viewer.zoom(properties.zoom)
                this.viewer.setOption("fisheye", properties.fisheye)
              }
            }).then(() => {
              // 动画完成后更新标记
              this.updateMarkers()
            })
          })
      })
    },
    // 更新场景中的标记
    updateMarkers() {
      const room = this.getRoomById(this.selectedRoom)
      this.markersPlugin.clearMarkers()

      // 创建新的标记列表
      const newMarkers = [
        // 添加标签标记
        ...room.labelList.map((item) => ({
          id: item.assetId,
          element: this.createLabelMarker(item),
          listContent: item.assetName,
          position: { yaw: item.position[1], pitch: item.position[0] },
          zIndex: 10
        })),
        // 添加链接标记
        ...room.link.map((link) => ({
          id: `link-${link.id}`,
          element: this.createLinkMarker(link),
          listContent: link.name,
          position: { yaw: link.position[1], pitch: link.position[0] },
          zIndex: 10
        }))
      ]

      // 设置标记到场景中
      this.markersPlugin.setMarkers(newMarkers)
    },
    // 创建标签标记元素
    createLabelMarker(item) {
      const markerElement = document.createElement("label-marker")
      markerElement.innerHTML = `<div class="tagBody">
        <p>名称: ${item.assetName}</p>
      </div>`
      return markerElement
    },
    // 创建链接标记元素
    createLinkMarker(link) {
      const markerElement = document.createElement("link-marker")
      markerElement.innerHTML = `<div class="tagBody">
        <p>${link.name}</p>
      </div>`
      markerElement.style.backgroundColor = "rgba(0, 0, 0, 0.7)"
      markerElement.style.color = "white"
      markerElement.style.cursor = "pointer"
      markerElement.style.borderRadius = "5px"
      // 添加点击事件处理
      markerElement.addEventListener("click", () => {
        this.previousRoom = this.selectedRoom
        this.selectedRoom = link.id
        this.changePanorama()
      })
      // 添加触摸事件处理
      markerElement.addEventListener("touchstart", () => {
        this.previousRoom = this.selectedRoom
        this.selectedRoom = link.id
        this.changePanorama()
      })
      return markerElement
    }
  },
  // 组件销毁时清理资源
  beforeUnmount() {
    if (this.viewer) {
      this.viewer.destroy()
    }
  }
}
</script>

<style lang="scss">
/* 全景图查看器容器样式 */
#viewer {
  position: fixed;
  width: 100%;
  height: 100%;
}

/* 自定义标记样式 */
.custom-marker {
  padding: 10px;
}

/* 提示框样式 */
.tooltip {
  padding: 10px;
}

/* 链接标记样式 */
.link-marker {
  padding: 10px;
}

/* 标签内容样式 */
.tagBody {
  font-size: 16px;
  font-weight: bold;
}
</style>
