import { brandAssets } from "@/data/brand";
import { portfolioAssetPath } from "@/data/portfolioCategories";

type DownloadStageProps = {
  isActive: boolean;
};

export function DownloadStage({ isActive }: DownloadStageProps) {
  return (
    <section
      className="home-stage-layer download-stage"
      aria-hidden={!isActive}
      aria-labelledby="download-stage-title"
      inert={!isActive ? true : undefined}
    >
      <div className="download-stage-frame">
        <p className="download-stage-meta-left">BEIMU / DOWNLOAD</p>
        <p className="download-stage-meta-right">ARCHIVE · RESERVED</p>

        <div className="download-stage-inner download-reserved">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="download-stage-mark"
            src={portfolioAssetPath(brandAssets.primaryVerticalWhite)}
            alt=""
            width={180}
            height={220}
          />
          <p className="download-reserved-kicker">DOWNLOAD / ARCHIVE</p>
          <h2 id="download-stage-title">下载</h2>
          <p className="download-reserved-status">EMPTY · RESERVED</p>
          <p className="download-reserved-copy">
            档案下载位置已预留。真实文件就绪后，将在此提供作品包与相关资料。
          </p>
        </div>
      </div>
    </section>
  );
}
