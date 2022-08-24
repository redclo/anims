import { css } from "@linaria/core";
import { defineComponent, ref, onMounted, reactive, nextTick } from "vue";
import { useCtx } from "../../context";
import { Button } from "ant-design-vue";

export default defineComponent({
    setup() {
        const { gameMap } = useCtx();
        const canvasRef = ref();
        const init: number[] = [];
        const state = reactive({ selected: init })

        document.oncontextmenu = function () {
            return false;
        }

        onMounted(() => {
            document.title = "地图";
            gameMap.actions.loadImages().then(() => {
                gameMap.actions.initWidthCanvas(canvasRef.value);
            })
        })

        const iconsRef = ref<{ index: number, imgRef: any }[]>([]);
        for (let i = 0; i < 25; i++) {
            iconsRef.value.push({ index: i, imgRef: ref() });
        }

        return () => (
            <div class={rootStyle}>
                <canvas ref={canvasRef} />
                <div class="hud">
                    <Button onClick={() => gameMap.actions.cleanSelect()}>清除选择</Button>
                    <Button onClick={() => {
                        gameMap.actions.saveTiles();
                    }}>保存</Button>
                    <Button onClick={() => {
                        gameMap.actions.loadLocalConfig();
                    }}>导入</Button>

                    <Button onClick={() => {
                        gameMap.state.showIcons = !gameMap.state.showIcons
                    }}>图标</Button>
                </div>

                <div class="hud-move">
                    <Button onClick={() => {
                        gameMap.actions.moveX(-gameMap.state.IconSize * 0.5);
                    }}>左移</Button>
                    <Button onClick={() => {
                        gameMap.actions.moveX(gameMap.state.IconSize * 0.5);
                    }}>右移</Button>
                    <Button onClick={() => {
                        gameMap.actions.moveY(-gameMap.state.IconSize * 0.5);
                    }}>上移</Button>
                    <Button onClick={() => {
                        gameMap.actions.moveY(gameMap.state.IconSize * 0.5);
                    }}>下移</Button>
                    <Button onClick={() => {
                        gameMap.actions.moveX(-gameMap.state.offsetX);
                        gameMap.actions.moveY(-gameMap.state.offsetY);
                    }}>归零</Button>
                </div>

                <div class={"icons " + (!gameMap.state.showIcons ? "hide" : "")}>
                    <div class={"items"}>
                        {
                            iconsRef.value.map(item => <img onClick={() => {
                                const i = state.selected.indexOf(item.index);
                                if (i == -1) {
                                    state.selected.push(item.index);
                                    return;
                                }
                                state.selected.splice(i, 1);
                            }} src={`./icons/${item.index + 1}.jpg`} alt={item + ""} key={item.index} class={state.selected.indexOf(item.index) > -1 ? "selected" : ""} />)
                        }
                    </div>

                    <Button onClick={() => {
                        gameMap.actions.insertIcons(state.selected);
                    }}>放置</Button>

                    <Button onClick={() => {
                        gameMap.actions.cleanIcons();
                    }}>清除</Button>
                </div>
            </div>
        );
    },
});

const rootStyle = css`
  background-color: black;
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  canvas {
    width: 100%;
    height: 100%;
  }

  .hud{
    position: absolute;
    right: 10px;
    top: 10px;
    .timer{
        font-size: 24px;
        color: white;
        margin-right: 10px;
    }
  }
  .hud-move {
    position: absolute;
    bottom: 10px;
    left: 50%;
  }

  .icons {
    position: absolute;
    right: 0px;
    top: 50px;
    width: 200px;

    .items {
        img{
            width: 40px;
        }
        .selected{
            border: 2px solid orange;
        }
    }
    &.hide{
        visibility: hidden;
    }
  }
`;
