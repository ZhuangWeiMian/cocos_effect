export default class RenderUtil {
    static getRenderTexture(node: cc.Node, out?: cc.RenderTexture) {
        // 检查参数
        if (!cc.isValid(node)) {
            return null;
        }
        if (!out || !(out instanceof cc.RenderTexture)) {
            out = new cc.RenderTexture();
        }
        // 获取宽高
        const width = Math.floor(node.width),
            height = Math.floor(node.height);
        // 初始化 RenderTexture
        out.initWithSize(width, height);
        // 创建临时摄像机用于渲染目标节点
        const cameraNode = new cc.Node();
        cameraNode.parent = node;
        const camera = cameraNode.addComponent(cc.Camera);
        camera.clearFlags |= cc.Camera.ClearFlags.COLOR;
        camera.backgroundColor = cc.color(0, 0, 0, 0);
        camera.zoomRatio = cc.winSize.height / height;
        // 将节点渲染到 RenderTexture 中
        camera.targetTexture = out;
        camera.render(node);
        // 销毁临时对象
        cameraNode.destroy();
        // 返回 RenderTexture
        return out;
    }

    static renderWithMaterial(srcRT: cc.RenderTexture, dstRT: cc.RenderTexture | cc.Material, material?: cc.Material) {
        // 检查参数
        if (dstRT instanceof cc.Material) {
            material = dstRT;
            dstRT = new cc.RenderTexture();
        }
        // 创建临时节点（用于渲染 RenderTexture）
        const tempNode = new cc.Node();
        tempNode.setParent(cc.Canvas.instance.node);
        const tempSprite = tempNode.addComponent(cc.Sprite);
        tempSprite.sizeMode = cc.Sprite.SizeMode.RAW;
        tempSprite.trim = false;
        tempSprite.spriteFrame = new cc.SpriteFrame(srcRT);
        // 获取图像宽高
        const width = srcRT.width,
            height = srcRT.height;
        // 初始化 RenderTexture
        dstRT.initWithSize(width, height);
        // 更新材质
        if (material instanceof cc.Material) {
            tempSprite.setMaterial(0, material);
        }
        // 创建临时摄像机（用于渲染临时节点）
        const cameraNode = new cc.Node();
        cameraNode.setParent(tempNode);
        const camera = cameraNode.addComponent(cc.Camera);
        camera.clearFlags |= cc.Camera.ClearFlags.COLOR;
        camera.backgroundColor = cc.color(0, 0, 0, 0);
        camera.zoomRatio = cc.winSize.height / height;
        // 将临时节点渲染到 RenderTexture 中
        camera.targetTexture = dstRT;
        camera.render(tempNode);
        // 销毁临时对象
        cameraNode.destroy();
        tempNode.destroy();
        // 返回 RenderTexture
        return dstRT;
    }

}