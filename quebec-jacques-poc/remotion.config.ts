import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setDelayRenderTimeoutInMilliseconds(60000);
Config.setConcurrency(1);
