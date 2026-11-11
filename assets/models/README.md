# 3D 模型放这里

网站会尝试加载：

    assets/models/pcb-51.obj      <-- 必填
    assets/models/pcb-51.mtl      <-- 可选（颜色/材质）

## 从立创EDA专业版导出

1. 打开 PCB → 顶部 **视图 → 3D 预览**；
2. 在 3D 预览窗口点 **导出**（或菜单 **文件 → 导出 → 3D 文件**）；
3. 格式选 **OBJ**（专业版也支持 **STEP**，用于结构装配，网页不能直接用）；
4. 导出的 `.obj` 改名为 `pcb-51.obj` 放到本目录；有 `.mtl` 就一并改名 `pcb-51.mtl`。

> 立创EDA 导出的 OBJ 内嵌材质，可能没有独立 .mtl —— 那样网页会用默认蓝灰色渲染。

## STEP 转网页格式

网页只认 OBJ / GLB。只有 STEP 时：

- **FreeCAD**：导入 STEP → 选中对象 → 文件 → 导出 → 选 OBJ / glTF；
- **Blender**：装 STEP 导入插件 → 导入 → 导出 glTF。
