# graphics-math

Mathematics library for **2D and 3D computer graphics**, written in TypeScript.

`graphics-math` provides the mathematical building blocks needed for graphics applications, game development, geometry processing and rendering systems, including vectors, matrices, rotations, interpolation and angle utilities.

The library is designed to be a **small, predictable and reusable foundation** for higher-level graphics libraries and applications.

## Features

* 2D, 3D and 4D vectors
* 2×2, 3×3 and 4×4 matrices
* Matrix arithmetic and transformations
* 3D rotation matrices
* Translation matrices
* Euler rotations
* Linear interpolation
* Inverse linear interpolation
* Angle utilities
* Common mathematical utilities
* TypeScript declarations included
* ESM support
* `Float32Array`-based matrix storage

## Installation

```bash
npm install graphics-math
```

## Usage

```ts
import {
    Vector3,
    Matrix4,
    lerp
} from "graphics-math";

const position = new Vector3(10, 20, 30);

const rotation = Matrix3.rotationY(Angle.radians(Math.PI / 2));

position.applyMatrix(rotation);

const value = lerp(0, 100, 0.5);
```

## API

### Vectors

#### `Vector2`

Represents a two-dimensional vector.

```ts
const vector = new Vector2(10, 20);

vector.add(new Vector2(5, 5));
vector.multiplyScalar(2);
```

#### `Vector3`

Represents a three-dimensional vector.

```ts
const vector = new Vector3(1, 2, 3);

const length = vector.length();

const normalized = vector.clone().normalize();

const dot = vector.dot(new Vector3(4, 5, 6));

const cross = vector.cross(new Vector3(4, 5, 6));
```

`Vector3` is intended for ordinary spatial geometry and includes operations such as:

* addition and subtraction
* scalar multiplication and division
* magnitude
* normalization
* distance
* dot product
* cross product
* angles
* interpolation

### `Vector4`

Represents a homogeneous coordinate used primarily with 4×4 transformation matrices.

The fourth component (`w`) determines how the value behaves during transformations:

- `w = 1` → point/position
- `w = 0` → direction

Use the factory methods when possible:

```ts
const point = Vector4.point(10, 20, 30);
const direction = Vector4.direction(1, 0, 0);
```

This distinction is important because translation transformations affect points but not directions.

Vector4 is therefore primarily a representation for homogeneous coordinates rather than a general-purpose four-dimensional spatial vector.

After a perspective transformation, perspectiveDivide() converts the homogeneous coordinate back into normalized Cartesian coordinates:

point.applyMatrix(projectionMatrix).perspectiveDivide();

Conceptually, the perspective divide performs:

x' = x / w
y' = y / w
z' = z / w

and then sets w to 1.
---

### Matrices

#### `Matrix`

Base abstraction for matrices of arbitrary dimensions.

Provides common matrix functionality such as:

* element access
* element modification
* copying
* size comparison
* addition

#### `Matrix2`

2×2 matrix.

#### `Matrix3`

3×3 matrix.

#### `Matrix4`

4×4 matrix primarily intended for graphics transformations.

Supports transformations such as:

* rotation around X
* rotation around Y
* rotation around Z
* combined rotation
* translation

Example:

```ts
const rotation = Matrix4.rotationY(Math.PI / 2);
const translation = Matrix4.translation(10, 20, 30);
```

## Transformations

Transformations use homogeneous coordinates and 4×4 matrices.

A point can be represented as:

```ts
const point = new Vector4(x, y, z, 1);
```

while a direction can be represented as:

```ts
const direction = new Vector4(x, y, z, 0);
```

This distinction allows translation matrices to affect positions without affecting directions.

For perspective transformations, the resulting homogeneous coordinate can be converted through a perspective divide:

```text
x' = x / w
y' = y / w
z' = z / w
```

The exact transformation convention used by an application should always be considered when combining matrices, including:

* row-vector vs column-vector conventions
* matrix multiplication order
* coordinate-system handedness
* normalized device coordinate conventions

## Interpolation

### `lerp`

Linear interpolation between two values.

```ts
const value = lerp(0, 100, 0.25);
// 25
```

### `inverseLerp`

Finds the normalized position of a value between two endpoints.

```ts
const t = inverseLerp(0, 100, 25);
// 0.25
```

These functions are useful for animation, interpolation, color operations, geometry and rendering.

## Angles

The `Angle` utilities provide explicit handling for angular values and conversions.

Keeping angle-related functionality separate from raw numeric values helps make APIs involving rotations and trigonometric operations easier to reason about.

## Design Decisions

`graphics-math` intentionally focuses on **mathematical primitives rather than rendering**.

The library does not provide:

* Canvas rendering
* WebGL rendering
* WebGPU rendering
* scene graphs
* cameras
* meshes
* textures
* materials
* game entities

Those responsibilities belong to higher-level libraries or applications.

### Why?

The goal is to keep the mathematics reusable.

A vector or matrix implementation should not need to know whether it is being used by:

* a Canvas renderer
* a WebGL engine
* a physics system
* a game
* a geometry library
* an image-processing application

This separation allows `graphics-math` to serve as a foundation for other projects.

### Mutable operations

Most vector and matrix operations mutate the current instance and return `this` when appropriate.

```ts
vector
    .add(a)
    .multiplyScalar(2)
    .normalize();
```

This avoids unnecessary allocations in code that performs many mathematical operations, which is particularly useful in graphics and real-time applications.

When a non-mutating result is required, `clone()` can be used explicitly.

### Typed arrays

Matrices use `Float32Array` internally.

This provides compact numeric storage and matches the representation commonly used by graphics APIs.

### Errors instead of silent failures

Invalid operations are treated as programming errors and throw exceptions instead of silently returning `null` or invalid values.

For example, accessing an element outside a matrix's dimensions results in an error.

This keeps invalid states visible and avoids forcing callers to constantly handle nullable results from operations that should normally be valid.

## TypeScript

The library is written entirely in TypeScript and ships with generated declaration files.

This means TypeScript projects receive complete type information automatically:

```ts
import { Vector3 } from "graphics-math";

const position: Vector3 = new Vector3(0, 0, 0);
```

## Building

Clone the repository and install dependencies:

```bash
npm install
```

Build the library:

```bash
npm run build
```

The compiled package is generated in `dist/`.

## Development

The source code is located in `src/`.

```text
src/
├── geometry/
│   ├── matrices/
│   │   ├── Matrix.ts
│   │   ├── Matrix2.ts
│   │   ├── Matrix3.ts
│   │   └── Matrix4.ts
│   ├── rotations/
│   │   └── EulerRotation.ts
│   └── vectors/
│       ├── Vector2.ts
│       ├── Vector3.ts
│       └── Vector4.ts
├── interpolation/
│   ├── inverseLerp.ts
│   └── lerp.ts
├── units/
│   └── Angle.ts
├── utils/
│   ├── clamp.ts
│   └── isBetween.ts
└── index.ts
```

`src/index.ts` defines the public API of the package.

Internal implementation details should not be imported directly when an equivalent public export is available.

## Project Philosophy

`graphics-math` follows a few simple principles:

**Keep the library focused.**

Mathematical primitives belong here. Higher-level graphics systems belong elsewhere.

**Prefer explicit behavior.**

Operations should be easy to understand without hidden state or unnecessary abstractions.

**Avoid premature features.**

New functionality should be added when it solves a real problem rather than simply increasing the API surface.

**Make invalid states visible.**

Unexpected dimensions, indices and other invalid operations should fail clearly.

**Optimize where it matters.**

The library uses mutable objects and typed arrays where they provide meaningful benefits for graphics workloads, without turning the API into an unnecessarily complex abstraction.

## Roadmap

The API is intentionally evolving alongside real graphics projects.

Potential future additions include:

* matrix multiplication improvements
* projection matrices
* scaling transformations
* additional rotation utilities
* quaternion support
* more interpolation functions
* additional geometric utilities
* expanded test coverage

Features will be added as their need becomes apparent through actual use.

## Related Projects

`graphics-math` is intended to serve as a mathematical foundation for higher-level graphics projects.

Possible layers include:

```text
graphics-math
      ↓
3D geometry / mesh library
      ↓
renderer
      ↓
game / graphics application
```

Keeping these layers separate allows each project to remain focused on one responsibility.

## License

MIT License.

Copyright © 2026 Bruno Fagundes
