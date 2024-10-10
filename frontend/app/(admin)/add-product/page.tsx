"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  cn,
  Input,
  Spacer,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
  Textarea,
} from "@nextui-org/react";
// @ts-ignore
// import Files from 'react-files'
import React, { useEffect, useState } from "react";
import NextImage from "next/image";
import { SolarGalleryAddOutline } from "@/components/icons/icons";

interface Variant {
  name: string;
  values: VariantValue[];
}

interface VariantValue {
  value: string;
}

interface VariantCombination {
  key: number;
  values: any;
  variantPrice: number;
}

interface Product {
  name: string;
  description: string;
  price: number;
}

const columns = [
  { key: "values", label: "Values" },
  { key: "price", label: "Price" },
];

//itertools.product
function generateVariantCombinations(
  variants: Variant[],
): VariantCombination[] {
  const result: VariantCombination[] = [];
  const variantValues = variants.map((variant) => variant.values);

  function backtrack(
    index: number,
    currentCombination: { [key: string]: string },
  ) {
    if (index === variantValues.length) {
      result.push({
        key: result.length,
        values: currentCombination,
        variantPrice: 0,
      });

      return;
    }

    for (const value of variantValues[index]) {
      const newCombination = { ...currentCombination };

      newCombination[variants[index].name] = value.value;
      backtrack(index + 1, newCombination);
    }
  }

  backtrack(0, {});

  return result;
}

export default function AddProductPage() {
  const [variantValues, setVariantValues] = useState<VariantValue[]>([
    { value: "" },
  ]);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const [variantCombinations, setVariantCombinations] = useState<
    VariantCombination[]
  >([]);

  const [product, setProduct] = useState<Product>({
    name: "",
    description: "",
    price: 0,
  });

  const [variants, setVariants] = useState<Variant[]>([]);

  const [maxChildIndex, setMaxChildIndex] = useState<number>(0);

  const [variantName, setVariantName] = React.useState("");

  const [isVariantEnabled, setIsVariantEnabled] = React.useState(false);

  const addVariants = () => {
    console.log("Before update:", variantValues);

    setVariants((prevVariants) => {
      const updatedVariants = [
        ...prevVariants,
        {
          name: variantName,
          values: variantValues.filter((value) => value.value !== ""),
        },
      ];

      const combinations = generateVariantCombinations(updatedVariants);

      setVariantCombinations(combinations);
      setVariantValues([{ value: "" }]);
      setMaxChildIndex(0);
      setVariantName("");

      return updatedVariants;
    });
  };

  const handleRemoveImage = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
  };

  useEffect(() => {
    console.log("After update:", variantValues);
  }, [variantValues]);

  const handleChildSubFieldValueChange = (value: string, index: number) => {
    setVariantValues((prevValues) => {
      const updatedValues = [...prevValues];

      updatedValues[index].value = value;
      if (index === maxChildIndex) {
        updatedValues.splice(index + 1, 0, { value: "" });
        setMaxChildIndex(index + 1);
      }

      return updatedValues;
    });
  };

  const saveProduct = async () => {
    console.log("Save Product");
    const jsonString = JSON.stringify({
      imageurls: imageUrls,
      name: product.name,
      description: product.description,
      size: [30, 30, 10],
      price: product.price,
      variants: variantCombinations,
    });

    console.log(jsonString);

    //Gửi dữ liệu lên server
    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonString,
      });

      if (response.ok) {
        console.log("Product saved successfully");
      } else {
        console.error("Failed to save product");
      }
    } catch (error) {
      console.error("Failed to save product", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className=" ">
        <Tabs aria-label="Options">
          <Tab key="image_address" title="Nhập đường dẫn ảnh">
            <Card>
              <CardBody>
                <Input
                  aria-label="Image Address"
                  className={"max-w-2xl"}
                  label={"Đường dẫn ảnh"}
                  labelPlacement={"inside"}
                  name={"image-address"}
                  placeholder={"Nhập đường dẫn ảnh"}
                  value={imageUrl}
                  onValueChange={(value: string) => setImageUrl(value)}
                />
                <Spacer y={1} />

                <Button
                  color={"primary"}
                  aria-label="Save Image Address"
                  variant={"shadow"}
                  fullWidth={false}
                  onPress={() => {
                    setImageUrls((prevUrls) => {
                      setImageUrl("");
                      return [...prevUrls, imageUrl];
                    });
                  }}
                >
                  Thêm ảnh
                </Button>
              </CardBody>
              <CardFooter className={"flex flex-col"}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <NextImage
                        src={url}
                        alt={`Preview ${index + 1}`}
                        width={40}
                        height={40}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <Button
                        color={"danger"}
                        variant={"shadow"}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveImage(index)}
                        isIconOnly={true}
                      >
                        X
                      </Button>
                    </div>
                  ))}
                </div>
              </CardFooter>
            </Card>
          </Tab>
          <Tab key="image_files" title="Tải tệp ảnh">
            <Card>
              <CardBody className={"items-center"}>
                <div
                  className={
                    "flex flex-col rounded-lg p-10 border-2 border-gray-200/20 border-dashed h-[250px] w-[250px]  backdrop-blur-xl bg-default"
                  }
                >
                  <div className={"bg-transparent "}>
                    <div className={"content-center"}>
                      <SolarGalleryAddOutline />
                    </div>

                    <div className={"flex flex-col gap-1 "}>
                      <span className={"text-sm"}>
                        Kéo và thả hoặc nhấp để tải lên
                      </span>
                      <span className={"text-sm"}>
                        Hình ảnh nên có kích thước 500x500 hoặc 800x800 và có
                        kích thước dưới 5MB
                      </span>
                      <input style={{ display: "none" }} type="file" />
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>

      <Spacer y={5} />

      <div
        className={
          "flex flex-col w-full text-center items-center justify-center gap-1 mt-4"
        }
      >
        <Input
          aria-label="Product Name"
          className={"max-w-2xl"}
          label={"Tên sản phẩm"}
          labelPlacement={"inside"}
          name={"product-name"}
          placeholder="Nhập tên sản phẩm"
          value={product?.name}
          onValueChange={(value: string) => {
            setProduct({
              ...product,
              name: value,
            });
          }}
        />

        <Spacer y={1} />

        <Textarea
          aria-label="Product Description"
          className={"max-w-2xl"}
          label={"Mô tả sản phẩm"}
          labelPlacement={"inside"}
          placeholder={"Nhập mô tả sản phẩm"}
          value={product?.description}
          onValueChange={(value) => {
            setProduct({
              ...product,
              description: value,
            });
          }}
        />

        <Spacer y={1} />

        <Card key={"Product Variants"} className={"max-w-2xl"} fullWidth={true}>
          <CardHeader>
            <Switch
              aria-label="Enable Variants"
              isSelected={isVariantEnabled}
              onChange={() => {
                if (isVariantEnabled) {
                  setVariants([]);
                  setVariantCombinations([]);
                  setProduct({
                    ...product,
                    price: 0,
                  });
                }
                setIsVariantEnabled(!isVariantEnabled);
              }}
            >
              Kích hoạt biến thể
            </Switch>
          </CardHeader>
          <CardBody className={"items-start"}>
            <div>
              {variants.map((variant, index) => (
                <div key={index} className={"w-full items-start"}>
                  <p className={"justify-start"}>{variant.name}</p>
                  <div>
                    {variant.values.map((value, subIndex) => (
                      <Chip
                        key={subIndex}
                        aria-label={`Variant Value ${value.value}`}
                      >
                        {value.value}
                      </Chip>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
          <CardFooter />
        </Card>

        <Spacer y={1} />

        {isVariantEnabled ? (
          <>
            <Card
              key={"Product Variants add"}
              className={"max-w-2xl"}
              fullWidth={true}
            >
              <CardHeader>Thêm biến thể của sản phẩm</CardHeader>
              <CardBody key={"Product Variants add"} className={"items-center"}>
                <Spacer y={1} />
                <Input
                  key={"variantName"}
                  aria-label="Add Variant"
                  className={"max-w-2xl"}
                  label={"Tên biến thể"}
                  labelPlacement={"inside"}
                  name={"variant-names"}
                  placeholder="Nhập tên biến thể"
                  value={variantName}
                  onValueChange={(value: string) => setVariantName(value)}
                />

                <Spacer y={2} />

                {variantValues.map((value, index) => (
                  <>
                    <Input
                      key={`VariantField-${index}`}
                      className={"max-w-2xl"}
                      defaultValue={value.value}
                      label={`Giá biến thể - ${index}`}
                      labelPlacement={"inside"}
                      name={`variant-value-${index}`}
                      value={value.value}
                      aria-label={`Variant Value ${index}`}
                      // onChange={(e) => handleChildSubFieldValueChange(e, index)}
                      onValueChange={(value: string) => {
                        handleChildSubFieldValueChange(value, index);
                      }}
                    />
                    <Spacer y={2} />
                  </>
                ))}

                <Spacer y={1} />

                <Button
                  aria-label="Thêm biến thể"
                  className={"w-fit"}
                  color="primary"
                  onPress={addVariants}
                >
                  Thêm biến thể
                </Button>
              </CardBody>
            </Card>

            <Table
              isCompact
              aria-label="Variant Number"
              className={"max-w-2xl"}
              color={"primary"}
              fullWidth={true}
              layout={"auto"}
              removeWrapper={false}
            >
              <TableHeader className={"flex"} columns={columns}>
                {(column) => (
                  <TableColumn
                    key={column.key}
                    className={cn([
                      column.key === "price"
                        ? "flex-auto w-28"
                        : "flex-auto w-48",
                    ])}
                  >
                    {column.label}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody
                emptyContent={"Chưa có biến thể nào."}
                items={variantCombinations}
              >
                {(item) => (
                  <TableRow key={item.key}>
                    <TableCell>
                      <div className={"sm:max-w-20 max-w-3xl"}>
                        {Object.keys(item.values).map((key, index) => {
                          if (index < 3) {
                            return (
                              <Chip key={index} aria-label={`Variant ${key}`}>
                                {item.values[key]}
                              </Chip>
                            );
                          }

                          return null;
                        })}
                      </div>
                    </TableCell>

                    <TableCell className={""}>
                      <Input
                        key={`price-${item.key}`}
                        aria-label={`price-${item.key}`}
                        className={"w-full"}
                        label={`Giá - ${item.key}`}
                        labelPlacement={"inside"}
                        name={`price-${item.key}`}
                        placeholder="10000"
                        size={"sm"}
                        tabIndex={item.key}
                        type={"number"}
                        onValueChange={(value: string) => {
                          //set variant price
                          setVariantCombinations((prevCombinations) => {
                            const updatedCombinations = [
                              ...(prevCombinations || []),
                            ];

                            updatedCombinations[item.key].variantPrice =
                              parseInt(value);

                            return updatedCombinations;
                          });
                        }}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </>
        ) : (
          <>
            <Input
              aria-label="Product Price"
              className={"max-w-2xl"}
              label={"Giá"}
              labelPlacement={"inside"}
              name={"price"}
              placeholder="Nhập giá sản phẩm"
              type={"number"}
              onValueChange={(value: string) => {
                setProduct({
                  ...product,
                  price: parseInt(value),
                });
              }}
            />
          </>
        )}

        <Spacer y={5} />

        <Button aria-label="Save Product" onPress={saveProduct}>
          Lưu sản phẩm
        </Button>
      </div>

      <Spacer y={10} />
    </div>
  );
}
