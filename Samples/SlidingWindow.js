var activity = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();

importSources();

function useItem(x, y, z, itemId, blockId, side) {
    var infoWindow = GUI.slidingWindow.create({
        size: 4,
        title: "Hello world!",
        message: "window!",
        horizontal_gravity: GUI.gravity.RIGHT
    });
    infoWindow.show();
    /*
    GUI.slidingWindow.create({
        size: 4,
        title: "Hello world!",
        message: "Window,window,window!",
        horizontal_gravity: GUI.gravity.RIGHT
    }).show();
    */
}

function leaveGame() {
    GUI.runUiCode(function() {
        GUI.removeAll();
    }, this);
}

//-------セットアップ-------

if (typeof newLevel === "function") {
    var oldNewLevel = newLevel;

    function newLevel() {
        GUI.setup();
        oldNewLevel();
    }
} else {
    function newLevel() {
        GUI.setup();
    }
}

var GUI = {
    assetsPath: null,
    rootView: null,
    gravity: null,
    guiImage: null,
    minecraftTextView: null,
    text: {
        rootView: null,
        create: null,
    },
    slidingWindow: {
        rootView: null,
        create: null
    },
    setup: function() {
        GUI.runUiCode(function() {
            var self = this;
            self.removeAll = function() {
                GUI.runUiCode(function() {
                    var rootWindow = self.rootView.getWindow();
                    rootWindow.dismiss();
                }, self);
            };

            self.rootView = function() {
                var my = {},
                    rootLayout = new android.widget.FrameLayout(activity),
                    rootLayoutParams = new android.widget.LinearLayout.LayoutParams(
                        android.widget.LinearLayout.LayoutParams.MATCH_PARENT,
                        android.widget.LinearLayout.LayoutParams.MATCH_PARENT
                    ),
                    rootWindow = new android.widget.PopupWindow();
                rootLayout.setLayoutParams(rootLayoutParams);
                rootLayout.setClickable(false);

                rootWindow.setTouchable(false);
                rootWindow.setContentView(rootLayout);
                rootWindow.setWidth(android.widget.RelativeLayout.LayoutParams.MATCH_PARENT);
                rootWindow.setHeight(android.widget.RelativeLayout.LayoutParams.MATCH_PARENT);
                rootWindow.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.TRANSPARENT));
                rootWindow.showAtLocation(activity.getWindow().getDecorView(), android.view.Gravity.CENTER, 0, 0);

                my.getWindow = function() {
                    return rootWindow;
                };
                my.getLayout = function() {
                    return rootLayout;
                }
                return my;
            }();

            self.gravity = {
                TOP: android.view.Gravity.TOP,
                BOTTOM: android.view.Gravity.BOTTOM,
                RIGHT: android.view.Gravity.RIGHT,
                LEFT: android.view.Gravity.LEFT,
                CENTER: android.view.Gravity.CENTER,
                CENTER_VERTICAL: android.view.Gravity.CENTER_VERTICAL,
                CENTER_HORIZONTAL: android.view.Gravity.CENTER_HORIZONTAL
            };

            self.guiImage = function() {
                var that = {};
                that.path = self.assetsPath + "/assets/images/gui/gui.png";
                that.originBitmap = android.graphics.BitmapFactory.decodeFile(that.path);
                that.members = {
                    achievement_window: function() {
                        var params = {};
                        params.startX = 130;
                        params.startY = 106;
                        params.sizeX = 120;
                        params.sizeY = 32;
                        params.bitmap = android.graphics.Bitmap.createBitmap(
                            that.originBitmap, params.startX, params.startY, params.sizeX, params.sizeY
                        );
                        return params;
                    },
                    achievement_icons: function() {
                        var my = {};
                        var parentStartX = 0;
                        var parentStartY = 184;
                        var iconSizeX = 18;
                        var iconSizeY = 18;
                        var icons = [
                            ["Speed", "Slowness", "Haste", "Mining_Fatigue", "Strength", "Weakness", "Poison", "Regeneration"],
                            ["Invisibility", "Hunger", "Jump_Boost", "Nausea", "Night_Vision", "Blindness", "Resistance", "Fire_Resistance"],
                            ["Water_Breathing", "Wither", "Yellow_Heart"]
                        ];
                        for (var cy = 0; cy < icons.length; cy++) {
                            for (var cx = 0; cx < icons[cy].length; cx++) {
                                var iconName = icons[cy][cx];
                                my[iconName] = function() {
                                    var params = {};
                                    params.startX = parentStartX + (iconSizeX * cx);
                                    params.startY = parentStartY + (iconSizeY * cy);
                                    params.sizeX = iconSizeX;
                                    params.sizeY = iconSizeY;
                                    params.bitmap = android.graphics.Bitmap.createBitmap(
                                        that.originBitmap, params.startX, params.startY, params.sizeX, params.sizeY
                                    );
                                    return params;
                                }();
                            }
                        }
                        return my;
                    }

                };
                return that;
            }();

            self.minecraftTextView = function(colorStr, size_px, droppingShadow) {
                var my = {},
                    frame = new android.widget.FrameLayout(activity),
                    mainText = new android.widget.TextView(activity),
                    minecraftFont = android.graphics.Typeface.createFromFile(self.assetsPath + "/font/minecraft_font.ttf"),
                    textColor = android.graphics.Color.parseColor(colorStr),
                    textSize = size_px * 8;

                var frameLayoutParams = new android.widget.FrameLayout.LayoutParams(
                    android.widget.FrameLayout.LayoutParams.WRAP_CONTENT, size_px * 10
                );
                frame.setLayoutParams(frameLayoutParams);
                frame.setClipChildren(false);
                frame.setClipToPadding(false);

                mainText.setTypeface(minecraftFont);
                mainText.setTextColor(textColor);
                mainText.setPadding(0, -(1 * size_px), 0, 0);
                mainText.setTextSize(android.util.TypedValue.COMPLEX_UNIT_PX, textSize);
                mainText.setIncludeFontPadding(false);

                if (droppingShadow) {
                    var shadowText = new android.widget.TextView(activity),
                        shadowColor = android.graphics.Color.rgb(
                            android.graphics.Color.red(textColor) * 0.25,
                            android.graphics.Color.green(textColor) * 0.25,
                            android.graphics.Color.blue(textColor) * 0.25
                        );
                    shadowText.setTypeface(minecraftFont);
                    shadowText.setTextColor(shadowColor);
                    shadowText.setTextSize(android.util.TypedValue.COMPLEX_UNIT_PX, textSize);
                    shadowText.setPadding(size_px, 0, 0, 0);
                    shadowText.setIncludeFontPadding(false);
                }

                my.setText = function(str) {
                    mainText.setText(str);
                    if (droppingShadow) {
                        shadowText.setText(str);
                    }
                };
                my.setPadding = function(left, top, right, bottom) {
                    frame.setPadding(left, top, right, bottom);
                };
                my.getRootView = function() {
                    return frame;
                };
                if (droppingShadow) {
                    frame.addView(shadowText);
                }
                frame.addView(mainText);

                return my;
            };


            self.text.rootView = function() {
                var rootLayout = new android.widget.FrameLayout(activity);
                var rootLayoutParams = new android.widget.LinearLayout.LayoutParams(
                    android.widget.LinearLayout.LayoutParams.MATCH_PARENT,
                    android.widget.LinearLayout.LayoutParams.MATCH_PARENT
                );
                rootLayout.setLayoutParams(rootLayoutParams);
                rootLayout.setClickable(false);
                self.rootView.getLayout().addView(rootLayout);
                return rootLayout;
            }();

            self.text.create = function(spec) {
                var that = this,
                    my = {},
                    size_px = spec.size || 4,
                    xOffset = spec.xOffset || 0,
                    yOffset = spec.yOffset || 0,
                    gravity = spec.gravity || (self.gravity.LEFT | self.gravity.TOP),
                    text = spec.text || "No Text",
                    textColor = spec.textColor || "#dedfde",
                    droppingShadow = spec.droppingShadow || false;

                for (valName in spec) {
                    clientMessage(valName + " : " + spec[valName])
                }
                var textViewLayout = new android.widget.FrameLayout(activity);
                textViewLayout.setPadding(xOffset, yOffset, 0, 0);
                textViewLayoutParams = new android.widget.FrameLayout.LayoutParams(
                    android.widget.FrameLayout.LayoutParams.WRAP_CONTENT,
                    android.widget.FrameLayout.LayoutParams.WRAP_CONTENT
                );
                textViewLayoutParams.gravity = gravity;
                textViewLayout.setLayoutParams(textViewLayoutParams);
                textViewLayout.setClickable(false);

                var textView = GUI.minecraftTextView(textColor, size_px, droppingShadow);
                textView.setText(text);

                textViewLayout.addView(textView.getRootView());

                my.show = function() {
                    GUI.runUiCode(function() {
                        self.rootView.getLayout().addView(textViewLayout);
                    }, self);
                };
                my.remove = function() {
                    self.rootView.getLayout().removeView(textViewLayout);
                };

                return my;
            }


            self.slidingWindow.rootView = function() {
                var rootLayout = new android.widget.FrameLayout(activity);
                var rootLayoutParams = new android.widget.LinearLayout.LayoutParams(
                    android.widget.LinearLayout.LayoutParams.MATCH_PARENT,
                    android.widget.LinearLayout.LayoutParams.MATCH_PARENT
                );
                rootLayout.setLayoutParams(rootLayoutParams);
                rootLayout.setClickable(false);
                self.rootView.getLayout().addView(rootLayout);
                return rootLayout;
            }();

            self.slidingWindow.create = function(spec) {
                var that = this,
                    my = {},
                    size_px = spec.size || 4,
                    title = spec.title || "No Title",
                    message = spec.message || "No Message",
                    gravity = ((spec.horizontal_gravity ? spec.horizontal_gravity : self.gravity.CENTER_HORIZONTAL) | self.gravity.TOP),
                    achievement_window = self.guiImage.members.achievement_window(),
                    achievement_icons = self.guiImage.members.achievement_icons(),
                    window_width_px = achievement_window.sizeX * size_px,
                    window_height_px = achievement_window.sizeY * size_px,
                    textSize = size_px;

                var frameImageBitmap = android.graphics.Bitmap.createScaledBitmap(
                        achievement_window.bitmap, window_width_px, window_height_px, false
                    ),
                    frameImage = new android.widget.ImageView(activity);
                frameImage.setImageBitmap(frameImageBitmap);

                //                                     黄色
                var titleText = self.minecraftTextView("#ffff00", textSize, false);
                titleText.setText(title);

                var textSpace = android.widget.Space(activity);
                textSpace.setLayoutParams(new android.widget.LinearLayout.LayoutParams(window_width_px, size_px));

                var messageText = self.minecraftTextView("#ffffff", textSize, false);
                messageText.setText(message);

                //テキストをまとめる
                var textsLayout = new android.widget.LinearLayout(activity);
                textsLayout.setOrientation(android.widget.LinearLayout.VERTICAL);
                textsLayout.addView(titleText.getRootView());
                textsLayout.addView(textSpace);
                textsLayout.addView(messageText.getRootView());

                var textWithIconLayout = new android.widget.LinearLayout(activity);
                var windowLayoutParams = new android.widget.FrameLayout.LayoutParams(
                    window_width_px,
                    window_height_px);
                textWithIconLayout.setOrientation(android.widget.LinearLayout.HORIZONTAL);
                textWithIconLayout.setGravity(android.view.Gravity.CENTER_VERTICAL);
                textWithIconLayout.setPadding(size_px * 6, 0, 0, 0);
                textWithIconLayout.addView(textsLayout);

                //ウィンドウの大本 クリックの処理などはここにつけよう
                var windowLayout = new android.widget.FrameLayout(activity);
                var windowLayoutParams = new android.widget.FrameLayout.LayoutParams(
                    window_width_px,
                    window_height_px,
                    gravity);
                windowLayout.addView(frameImage);
                windowLayout.addView(textWithIconLayout);

                var inAnim = function() {
                    var anim = new android.view.animation.TranslateAnimation(0, 0, -window_height_px, 0);
                    anim.setDuration(500);
                    return anim;
                };
                var waitAnim = function() {
                    var anim = new android.view.animation.TranslateAnimation(0, 0, 0, 0);
                    anim.setDuration(1000);
                    return anim;
                };
                var outAnim = function() {
                    var anim = new android.view.animation.TranslateAnimation(0, 0, 0, -window_height_px);
                    anim.setDuration(500);
                    return anim;
                };

                my.show = function() {
                    GUI.runUiCode(function() {
                        var inAnimation = inAnim();
                        var waitAnimation = waitAnim();
                        var outAnimation = outAnim();

                        inAnimation.setAnimationListener(new android.view.animation.Animation.AnimationListener({
                            onAnimationEnd: function(anim) {
                                //in -> wait
                                windowLayout.startAnimation(waitAnimation);
                            }
                        }));
                        waitAnimation.setAnimationListener(new android.view.animation.Animation.AnimationListener({
                            onAnimationEnd: function(anim) {
                                //wait -> out
                                windowLayout.startAnimation(outAnimation);
                            }
                        }));
                        outAnimation.setAnimationListener(new android.view.animation.Animation.AnimationListener({
                            onAnimationEnd: function(anim) {
                                that.rootView.removeView(windowLayout);
                            }
                        }));

                        that.rootView.addView(windowLayout, windowLayoutParams);
                        windowLayout.startAnimation(inAnimation);
                    }, self);
                };

                return my;
            }
        }, this);
    },
    runUiCode: function(code, that, args) {
        args = args || [];
        activity.runOnUiThread(new java.lang.Runnable() {
            run: function() {
                try {
                    code.apply(that, args);
                } catch (error) {
                    clientMessage(error);
                }
            }
        });
    }
};

function importSources() {
    activity.runOnUiThread(new java.lang.Runnable() {
        run: function() {
            try {
                var sourcesPath = android.os.Environment.getExternalStorageDirectory().getAbsolutePath() + "/games/com.mojang";
                new java.io.File(sourcesPath).mkdir();

                var zipOutputDir = new java.io.File(sourcesPath, "source");
                var zipFile = new java.io.File(sourcesPath, "source.zip");
                var sourceFile = new java.io.File(sourcesPath);
                GUI.assetsPath = zipOutputDir.getAbsolutePath();

                var progressDialog = new android.app.ProgressDialog(activity);
                progressDialog.setTitle("処理中");
                progressDialog.setMessage("しばらくお待ちください...");
                progressDialog.setProgressStyle(android.app.ProgressDialog.STYLE_SPINNER);
                progressDialog.setCancelable(false);
                progressDialog.show();

                //遅いzip解凍などの処理はThreadで
                new java.lang.Thread(new java.lang.Runnable({
                    run: function() {

                        //sourceフォルダがなければ
                        if (!zipOutputDir.exists()) {
                            downloadFileFromUrl("https://drive.google.com/uc?export=download&id=0B--Q9jIEQq-KWFcxdXp4Z2lhOVU", zipFile);
                            sourceFile.mkdir();
                            extractZip(zipFile, sourceFile, 4);
                            zipFile.delete();
                        }

                        progressDialog.dismiss();
                    }
                })).start();
            } catch (error) {
                clientMessage(error);
            }
        }
    });
}

//-------ファイル関連-------

function copyFile(inputFile, outputFile) {
    var input =
        (new java.io.FileInputStream(inputFile))
        .getChannel();
    var output =
        (new java.io.FileOutputStream(outputFile))
        .getChannel();
    output.transferFrom(input, 0, input.size());
}

function extractZip(inputZipFile, outPutDir, bufferLevel) {
    try {
        var buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024 * bufferLevel);
        var zis = new java.util.zip.ZipInputStream(new java.io.FileInputStream(inputZipFile));
        var entry;

        while ((entry = zis.getNextEntry()) != null) {
            clientMessage(entry.getName());
            var entryFile = new java.io.File(outPutDir.getAbsolutePath(), entry.getName());
            if (entry.isDirectory()) {
                entryFile.mkdirs();
            } else {
                if (entryFile.getParentFile() != null &&
                    !entryFile.getParentFile().exists()) {
                    entryFile.getParentFile().mkdirs();
                }

                if (!entryFile.exists()) {
                    entryFile.createNewFile();
                }

                var fout = new java.io.FileOutputStream(entryFile);

                var count;
                while ((count = zis.read(buffer)) != -1) {
                    fout.write(buffer, 0, count);
                }

                fout.close();
            }

            zis.closeEntry();
        }
        return true;

    } catch (e) {
        clientMessage(e);
        return false;
    }
}

//-------ネット関連-------

function downloadFileFromUrl(downloadUrl, outputFile) {
    outputFile.createNewFile();

    var url = new java.net.URL(downloadUrl);
    var input = new java.io.BufferedInputStream(url.openStream());

    var fout = new java.io.FileOutputStream(outputFile);

    var buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024 * 4);
    var count;
    while ((count = input.read(buffer, 0, 1024 * 4)) != -1) {
        fout.write(buffer, 0, count);
    }
}
