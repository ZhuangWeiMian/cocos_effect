import RenderUtils from '../render_utils';
const { ccclass, property } = cc._decorator;

@ccclass
export default class Case_Bloom extends cc.Component {

    @property({ type: cc.Sprite, tooltip: CC_DEV && '精灵组件' })
    protected sprite: cc.Sprite = null;

    @property({ type: cc.Material, tooltip: CC_DEV && '渲染用的材质' })
    protected material_highlight: cc.Material = null;

    @property({ type: cc.Material, tooltip: CC_DEV && '渲染用的材质' })
    protected material_gaussian: cc.Material = null;

    @property({ type: cc.Material, tooltip: CC_DEV && '渲染用的材质' })
    protected material_mix: cc.Material = null;

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
        const dst1RT = new cc.RenderTexture();
        const dst2RT = new cc.RenderTexture();
        const finalRT = new cc.RenderTexture();
        // 获取初始 RenderTexture
        RenderUtils.getRenderTexture(node, srcRT);
        // 多 Pass 处理
        // 注：由于 OpenGL 中的纹理是倒置的，所以双数 Pass 的出的图像是颠倒的
        
        // 提取高亮部分
        RenderUtils.renderWithMaterial(srcRT, dst1RT, this.material_highlight);
        // 进行高斯模糊
        RenderUtils.renderWithMaterial(dst1RT, dst2RT, this.material_gaussian);
        // 进行混合
        this.material_mix.setProperty('mixTexture', dst2RT);
        RenderUtils.renderWithMaterial(srcRT, finalRT, this.material_mix);

        // 使用经过处理的 RenderTexture
        this.renderTexture = finalRT;
        sprite.spriteFrame = new cc.SpriteFrame(this.renderTexture);
        // 销毁不用的临时 RenderTexture
        srcRT.destroy();
        dst1RT.destroy();
        dst2RT.destroy();
    }

    /**
     * 生命周期：销毁
     */
    protected onDestroy(): void {
        // 销毁不用的 RenderTexture
        this.renderTexture && this.renderTexture.destroy();
    }
}