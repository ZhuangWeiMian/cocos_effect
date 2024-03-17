import RenderUtils from '../render_utils';
const { ccclass, property } = cc._decorator;

// 双pass会导致翻转
@ccclass
export default class Case_Gaussian_Blur extends cc.Component {

    @property({ type: cc.Sprite, tooltip: CC_DEV && '精灵组件' })
    protected sprite: cc.Sprite = null;

    @property({ type: cc.Material, tooltip: CC_DEV && '渲染用的材质' })
    protected material_horizontal: cc.Material = null;

    @property({ type: cc.Material, tooltip: CC_DEV && '渲染用的材质' })
    protected material_vertical: cc.Material = null;

    /**
     * 正在使用的 RenderTexture
     */
    protected renderTexture: cc.RenderTexture = null;

    /**
     * 生命周期：开始（首次 update 前）
     */
    protected start() {
        // 目标节点
        const sprite = this.sprite;
        const node = this.sprite.node;
        // 设置材质
        // 创建临时 RenderTexture
        const srcRT = new cc.RenderTexture();
        const dstRT = new cc.RenderTexture();
        // 获取初始 RenderTexture
        RenderUtils.getRenderTexture(node, srcRT);
        // 多 Pass 处理 一个在图片的material中进行使用
        RenderUtils.renderWithMaterial(srcRT, dstRT, this.material_vertical);

        // 使用经过处理的 RenderTexture
        this.renderTexture = dstRT;
        sprite.spriteFrame = new cc.SpriteFrame(this.renderTexture);
        // 销毁不用的临时 RenderTexture
        srcRT.destroy();
    }

    /**
     * 生命周期：销毁
     */
    protected onDestroy(): void {
        // 销毁不用的 RenderTexture
        this.renderTexture && this.renderTexture.destroy();
    }
}