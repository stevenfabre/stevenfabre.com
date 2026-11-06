"use client";
import { useEffect } from "react";
import {
  afterPageLoad,
  preloadMedia,
  type MediaAsset,
} from "../../src/utils/preloadMedia";
export default function PreloadProjects({ assets }: { assets: MediaAsset[] }) {
  useEffect(() => afterPageLoad(() => assets.forEach(preloadMedia)), [assets]);
  return null;
}
